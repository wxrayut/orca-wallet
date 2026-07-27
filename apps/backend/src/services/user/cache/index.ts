import type { User } from "@prisma/client";

import { redis } from "../../../lib";
import type { UserData } from "../../../types";

export class UserCache {
    private static key(key: string) {
        return `user:${key}`;
    }

    public static async set(key: string, data: UserData, ttl: number = 300) {
        await redis.set(this.key(key), JSON.stringify(data), "EX", ttl);
    }

    public static async setNull(key: string, ttl: number = 60) {
        await redis.set(this.key(key), "null", "EX", ttl);
    }

    public static async get(key: string): Promise<User | null> {
        const raw = await redis.get(this.key(key));

        if (!raw) return null;
        if (raw === "null") return null;

        return JSON.parse(raw) as User;
    }

    public static async invalidate(key: string): Promise<void> {
        await redis.del(this.key(key));
    }
}
