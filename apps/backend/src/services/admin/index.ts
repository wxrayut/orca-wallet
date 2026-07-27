import { Role, TransactionStatus, User } from "@prisma/client";

import { DashBoardStats } from "@orca-wallet/shared";

import { prisma } from "../../lib";

export class AdminService {
    public static async getDashBoardStats(): Promise<DashBoardStats> {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            totalAdmins,
            activeUsers,
            totalWallets,
            totalTransactions,
            completedTransactions,
            pendingTransactions,
            failedTransactions,
            userGrowthLastDay,
            userGrowthLastWeek,
            userGrowthLastMonth,
        ] = await Promise.all([
            prisma.user.count({ where: { role: Role.USER } }),
            prisma.user.count({ where: { role: Role.ADMIN } }),
            prisma.user.count({ where: { isActive: true } }),
            prisma.wallet.count(),
            prisma.transaction.count(),
            // prettier-ignore
            prisma.transaction.count({ where: { status: TransactionStatus.COMPLETED } }),
            // prettier-ignore
            prisma.transaction.count({ where: { status: TransactionStatus.PENDING } }),
            // prettier-ignore
            prisma.transaction.count({ where: { status: TransactionStatus.FAILED } }),
            prisma.user.count({ where: { createdAt: { gte: oneDayAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: oneMonthAgo } } }),
        ]);

        return {
            totalUsers,
            totalAdmins,
            activeUsers,
            totalWallets,
            totalTransactions,
            completedTransactions,
            pendingTransactions,
            failedTransactions,
            userGrowthLastDay,
            userGrowthLastWeek,
            userGrowthLastMonth,
        };
    }

    public static async getRecentTransactions() {
        return prisma.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
            include: {
                transfers: true,
            },
        });
    }

    public static async getUsers(): Promise<User[]> {
        return prisma.user.findMany({
            where: {
                role: Role.USER,
            },
        });
    }

    public static async deleteUserById(id: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    role: true,
                },
            });

            if (!user) {
                throw new Error("User not found");
            }

            if (user.role === Role.ADMIN) {
                throw new Error("Cannot delete admin user");
            }

            const wallets = await tx.wallet.findMany({
                where: {
                    userId: id,
                },
                select: {
                    id: true,
                },
            });
            const walletIds = wallets.map((wallet) => wallet.id);
            const transactions = walletIds.length
                ? await tx.transaction.findMany({
                      where: {
                          walletId: {
                              in: walletIds,
                          },
                      },
                      select: { id: true },
                  })
                : [];

            const transactionIds = transactions.map((transaction) => transaction.id);

            if (transactionIds.length > 0) {
                await tx.transactionReceipt.deleteMany({
                    where: {
                        transactionId: {
                            in: transactionIds,
                        },
                    },
                });
                await tx.tokenTransfer.deleteMany({
                    where: {
                        transactionId: {
                            in: transactionIds,
                        },
                    },
                });
                await tx.transaction.deleteMany({
                    where: {
                        id: {
                            in: transactionIds,
                        },
                    },
                });
            }

            if (walletIds.length > 0) {
                await tx.wallet.deleteMany({
                    where: {
                        id: {
                            in: walletIds,
                        },
                    },
                });
            }

            await tx.user.delete({
                where: { id },
            });
        });
    }
}
