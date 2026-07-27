import { Role } from "@prisma/client";

import { adminConfig } from "../config";
import { OrcaBcrypt } from "../core";
import { UserService } from "../services";

import { Logger } from "./logger";

export async function setupAdmin() {
    try {
        const user = await UserService.getByIdentifier(adminConfig.email);

        if (!user) {
            const passwordHash = await OrcaBcrypt.hash(adminConfig.password);

            await UserService.create({
                email: adminConfig.email,
                username: adminConfig.username,
                password: passwordHash,
                avatar: null,
                role: Role.ADMIN,
                isVerified: true,
                isActive: false,
                lastLogin: null,
            });

            return;
        }
    } catch (error) {
        Logger.error(error);
    }
}
