import crypto from "node:crypto";

import { Purpose } from "@orca-wallet/shared";

import { appConfig } from "../config";
import { redis, resend } from "../lib";
import type { OtpAssignOptions, OtpRedisKeys } from "../types";

import { Logger } from "./logger";

export class OrcaOTP {
    private static OTP_TTL = 300; // 5 min
    private static COOLDOWN_TTL = 60; // 1 min
    private static MAX_ATTEMPTS = 5; // max tries
    private static LOCK_TTL = 600; // 10 min

    private static code(length: number = 6): string {
        let otp = "";

        for (let i = 0; i < length; i++) {
            otp += crypto.randomInt(0, 10).toString();
        }

        return otp;
    }

    private static hash(code: string): string {
        return crypto.createHash("sha256").update(code).digest("hex");
    }

    private static key(email: string, purpose: Purpose): OtpRedisKeys {
        const base = `otp:${purpose}:${email}`;

        return {
            otp: `${base}`,
            cooldown: `${base}:cooldown`,
            attempt: `${base}:attempt`,
            lock: `${base}:lock`,
        };
    }

    public static async assign(
        email: string,
        purpose: Purpose,
        options?: OtpAssignOptions,
    ): Promise<void> {
        const keys = this.key(email, purpose);

        const [locked, cooldown] = await Promise.all([
            redis.get(keys.lock),
            redis.get(keys.cooldown),
        ]);

        if (locked) {
            throw new Error(
                "Too many failed attempts. Please wait before requesting a new OTP.",
            );
        }
        if (cooldown) {
            throw new Error(
                "OTP request is on cooldown. Please wait before requesting a new OTP.",
            );
        }

        const length = options?.length ?? 6;
        const ttl = options?.expiryTime ?? this.OTP_TTL;

        const code = this.code(length);
        const hash = this.hash(code);

        const pipeline = redis.multi();

        pipeline.setex(keys.otp, ttl, hash);
        pipeline.setex(keys.cooldown, this.COOLDOWN_TTL, "1");

        pipeline.del(keys.attempt);

        await pipeline.exec();

        // Log the generated OTP for debugging purposes (only in non-production environments)
        if (!appConfig.isProduction) {
            Logger.info(`Generated OTP for ${email} (${purpose}): ${code}`);
            return;
        }

        // Send the OTP via email using Resend
        const { error } = await resend.emails.send({
            from: "Orca Wallet <onboarding@orca-wallet.xyz>",
            to: [email],
            subject: "Your Orca Wallet OTP Code",
            text: `Your OTP code is ${code}. It expires in 5 minutes.`,
            html: `
<p>Your OTP code is:</p>
<h2>${code}</h2>
<p>This code expires in 5 minutes.</p>
`,
        });

        if (error) {
            Logger.error(
                `Failed to send OTP email to ${email} (${purpose}): ${error.message}`,
            );
            throw new Error("Failed to send OTP email. Please try again later.");
        }
    }

    public static async verify(
        email: string,
        purpose: Purpose,
        code: string,
    ): Promise<boolean> {
        const keys = this.key(email, purpose);

        if (await redis.get(keys.lock)) {
            throw new Error(
                "Too many failed attempts. Please wait before requesting a new OTP.",
            );
        }

        const storedHash = await redis.get(keys.otp);
        if (!storedHash) {
            return false;
        }

        const hashedCode = this.hash(code);
        if (storedHash === hashedCode) {
            await this.clear(email, purpose);
            return true;
        }

        const pipeline = redis.multi();

        pipeline.incr(keys.attempt);
        pipeline.expire(keys.attempt, this.OTP_TTL);

        const result = await pipeline.exec();
        const attempts = Number(result?.[0]?.[1] ?? 0);

        if (attempts >= this.MAX_ATTEMPTS) {
            const lockPipe = redis.multi();

            lockPipe.setex(keys.lock, this.LOCK_TTL, "1");
            lockPipe.del(keys.otp, keys.cooldown, keys.attempt);

            await lockPipe.exec();
        }

        return false;
    }

    public static async clear(email: string, purpose: Purpose): Promise<void> {
        const keys = this.key(email, purpose);

        await redis.del(keys.otp, keys.cooldown, keys.attempt, keys.lock);
    }
}
