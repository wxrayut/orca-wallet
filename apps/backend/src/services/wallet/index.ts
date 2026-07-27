import type { Wallet } from "@prisma/client";

import type { HistoryResponse } from "@orca-wallet/shared";

import { prisma } from "../../lib";
import type { WalletData, WalletInclude } from "../../types";
import { TransactionReceiptService } from "../receipt";
import { TokenService } from "../token";
import { TransactionService } from "../transaction";

// import { WalletCache } from "./cache";

export class WalletService {
    public static async create(data: WalletData): Promise<Wallet> {
        const wallet = await prisma.wallet.create({ data });

        if (wallet) {
        }

        return wallet;
    }

    public static async createActivity(
        id: string,
        data: HistoryResponse,
    ): Promise<void> {
        const { receipt, transfers, ...transaction } = data;

        const tx = await TransactionService.create({
            walletId: id,
            ...transaction,
        });

        await TransactionReceiptService.create({
            transactionId: tx.id,
            ...receipt,
        });
        await TokenService.createMany([
            ...data.transfers.map((transfer) => ({
                transactionId: tx.id,
                ...transfer,
            })),
        ]);
    }

    public static async getById(id: string): Promise<Wallet | null> {
        return prisma.wallet.findUnique({
            where: {
                id,
            },
        });
    }

    public static async getByAddress(address: string): Promise<Wallet | null> {
        return prisma.wallet.findUnique({
            where: {
                address,
            },
        });
    }

    public static async getByPendingAddresses(
        addresses: string[],
    ): Promise<Wallet[] | null> {
        return prisma.wallet.findMany({
            where: {
                address: {
                    in: addresses,
                },
            },
        });
    }

    public static async getByUserId(id: string): Promise<Wallet[] | null> {
        return prisma.wallet.findMany({
            where: {
                user: {
                    id,
                },
            },
        });
    }

    public static async getByEmail(email: string): Promise<Wallet[] | null> {
        return prisma.wallet.findMany({
            where: {
                user: {
                    email,
                },
            },
        });
    }

    public static async getByUsername(username: string): Promise<Wallet[] | null> {
        return prisma.wallet.findMany({
            where: {
                user: {
                    username,
                },
            },
        });
    }

    public static async updateById(
        id: string,
        data: Partial<WalletData>,
    ): Promise<Wallet> {
        return prisma.wallet.update({
            where: {
                id,
            },
            data,
        });
    }

    public static async updateLabelById(id: string, label: string): Promise<Wallet> {
        return this.updateById(id, {
            label,
        });
    }

    public static async updateDefaultById(
        id: string,
        isDefault: boolean = true,
    ): Promise<Wallet> {
        // If setting this wallet as default, unset the previous default wallet
        await prisma.wallet.updateMany({
            data: {
                isDefault: false,
            },
        });
        // Then set the new default wallet
        return this.updateById(id, {
            isDefault,
        });
    }

    public static async deleteById(id: string): Promise<void> {
        return prisma.$transaction(async (p) => {
            // Delete all transactions related to the wallet, including
            // token transfers and receipts
            const transactions = await p.transaction.findMany({
                where: {
                    walletId: id,
                },
                select: {
                    id: true,
                },
            });

            // Extract transaction IDs to delete related token transfers
            // and receipts
            const ids = transactions.map((tx) => tx.id);

            await p.tokenTransfer.deleteMany({
                where: {
                    transactionId: {
                        in: ids,
                    },
                },
            });
            await p.transactionReceipt.deleteMany({
                where: {
                    transactionId: {
                        in: ids,
                    },
                },
            });
            await p.transaction.deleteMany({
                where: {
                    walletId: id,
                },
            });
            await p.wallet.delete({
                where: {
                    id,
                },
            });
        });
    }
}
