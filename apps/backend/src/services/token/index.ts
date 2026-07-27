import type { TokenTransfer } from "@prisma/client";

import { prisma } from "../../lib";
import type { TokenTransferData, TokenTransferInclude } from "../../types";

// import { TokenTransferCache } from "./cache";

export class TokenService {
    public static async create(data: TokenTransferData) {
        return prisma.tokenTransfer.create({ data });
    }

    public static async createMany(data: TokenTransferData[]) {
        return prisma.tokenTransfer.createMany({ data });
    }
}
