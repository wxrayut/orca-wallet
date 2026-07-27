import type { User } from "@prisma/client";

import { prisma } from "../../lib";
import type { UserData, UserInclude } from "../../types";

import { UserCache } from "./cache";

export class UserService {
    public static async create(data: UserData): Promise<User> {
        const user = await prisma.user.create({ data });

        if (user) {
            await UserCache.set(user.id, user);
        }

        return user;
    }

    public static async get(): Promise<User[]> {
        return await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    public static async getByIdentifier(
        identifier: string,
        include?: UserInclude,
    ): Promise<User | null> {
        const cached = await UserCache.get(identifier);

        if (cached) {
            return cached;
        }

        const where = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
            ? { email: identifier }
            : { username: identifier };
        const user = await prisma.user.findUnique({
            where,
            ...(include ? { include } : {}),
        });

        if (user) {
            await UserCache.set(identifier, user);
        }

        return user;
    }

    public static async updateById(
        id: string,
        data: Partial<UserData>,
    ): Promise<User> {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data,
        });

        if (user) {
            await UserCache.set(user.id, user);
        }

        return user;
    }

    public static async updateByEmail(
        email: string,
        data: Partial<UserData>,
    ): Promise<User> {
        const user = await prisma.user.update({
            where: {
                email,
            },
            data,
        });

        if (user) {
            await UserCache.set(user.id, user);
        }

        return user;
    }

    public static async updateByUsername(
        username: string,
        data: Partial<UserData>,
    ): Promise<User> {
        const user = await prisma.user.update({
            where: {
                username,
            },
            data,
        });

        if (user) {
            await UserCache.set(user.id, user);
        }

        return user;
    }

    public static async deleteById(id: string): Promise<User> {
        const user = await prisma.user.delete({
            where: {
                id,
            },
        });

        if (user) {
            await UserCache.invalidate(user.id);
        }

        return user;
    }

    public static async deleteByEmail(email: string): Promise<User> {
        const user = await prisma.user.delete({
            where: {
                email,
            },
        });

        if (user) {
            await UserCache.invalidate(user.id);
        }

        return user;
    }

    public static async deleteByUsername(username: string): Promise<User> {
        const user = await prisma.user.delete({
            where: {
                username,
            },
        });

        if (user) {
            await UserCache.invalidate(user.id);
        }

        return user;
    }
}
