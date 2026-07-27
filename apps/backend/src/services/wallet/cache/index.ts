import type { Wallet } from "@prisma/client";

import { redis } from "../../../lib";
import type { WalletData } from "../../../types";

export class WalletCache {
    private static key(key: string) {
        return `wallet:${key}`;
    }

    public static async set(key: string, data: WalletData, ttl: number = 300) {
        await redis.set(this.key(key), JSON.stringify(data), "EX", ttl);
    }

    public static async setNull(key: string, ttl: number = 60) {
        await redis.set(this.key(key), "null", "EX", ttl);
    }

    public static async get(key: string): Promise<Wallet | null> {
        const raw = await redis.get(this.key(key));

        if (!raw) return null;
        if (raw === "null") return null;

        return JSON.parse(raw) as Wallet;
    }

    public static async invalidate(key: string): Promise<void> {
        await redis.del(this.key(key));
    }
}
