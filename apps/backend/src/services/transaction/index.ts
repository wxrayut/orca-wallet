import { type Transaction, TransactionStatus } from "@prisma/client";

import { prisma } from "../../lib";
import type { TransactionData, TransactionInclude } from "../../types";

// import { TransactionCache } from "./cache";

export class TransactionService {
    public static async create(data: TransactionData): Promise<Transaction> {
        return prisma.transaction.create({ data });
    }

    public static async getByWalletId(
        walletId: string,
        include: Partial<TransactionInclude>,
    ): Promise<Transaction[]> {
        return prisma.transaction.findMany({
            where: {
                walletId,
            },
            include,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    public static async getPendingTransactions(
        txHashes: string[],
    ): Promise<Transaction[]> {
        return prisma.transaction.findMany({
            where: {
                txHash: {
                    in: txHashes,
                },
                status: TransactionStatus.PENDING,
            },
        });
    }

    public static async updateById(
        id: string,
        data: Partial<TransactionData>,
    ): Promise<Transaction> {
        return prisma.transaction.update({
            where: {
                id,
            },
            data,
        });
    }

    public static async makeComplete(
        id: string,
        data?: Partial<TransactionData>,
    ): Promise<void> {
        await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                ...data,
                status: TransactionStatus.COMPLETED,
            },
        });
    }

    public static async makeFailed(
        id: string,
        data?: Partial<TransactionData>,
    ): Promise<void> {
        await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                ...data,
                status: TransactionStatus.FAILED,
            },
        });
    }
}
