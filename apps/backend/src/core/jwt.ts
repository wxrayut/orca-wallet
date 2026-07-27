import jwt from "jsonwebtoken";

import { jwtConfig } from "../config";
import type { JWTSignOptions, JWTVerifyOptions } from "../types";

export class OrcaJWT {
    static sign(
        payload: object,
        secret: string,
        options?: JWTSignOptions,
    ): string {
        const expiresIn = options?.expiresIn ?? "7d";

        return jwt.sign(payload, secret, { expiresIn });
    }

    static fastSign(payload: object, options?: JWTSignOptions): string {
        const accessSecret = jwtConfig.accessSecret;

        return this.sign(payload, accessSecret, options);
    }

    static verify<T = unknown>(
        token: string,
        secret: string,
        options?: JWTVerifyOptions,
    ): T | null {
        try {
            return jwt.verify(token, secret, options) as T;
        } catch {
            return null;
        }
    }

    static fastVerify<T = unknown>(token: string): T | null {
        if (!token) {
            return null;
        }

        const accessSecret = jwtConfig.accessSecret;

        return this.verify(token, accessSecret);
    }

    static decode<T = unknown>(token: string): T | null {
        try {
            return jwt.decode(token) as T | null;
        } catch {
            return null;
        }
    }
}
