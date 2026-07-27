import util from "node:util";

import { type Transaction, TransactionStatus } from "@prisma/client";
import type { TransactionResponse } from "ethers";

import type { HistoryResponse } from "@orca-wallet/shared";

import { orcaProvider } from "../blockchain";
import { OrcaWallet } from "../core";
import { limiter, prisma } from "../lib";
import {
    TokenService,
    TransactionReceiptService,
    TransactionService,
    WalletService,
} from "../services";
import type { WalletContext } from "../types";
import { Logger } from "../utils";

function isTransactionResponse(
    tx: TransactionResponse | null,
): tx is TransactionResponse {
    return tx !== null && tx.from !== undefined && tx.to !== undefined;
}

async function getHistory(wallet: OrcaWallet) {
    const history = await wallet.history();
    const historyMap = new Map<string, HistoryResponse>();

    for (const item of history) {
        historyMap.set(item.txHash.toLowerCase(), item);
    }

    return historyMap;
}

async function handleSender(
    walletId: string,
    existing: Transaction | null,
    transaction: HistoryResponse,
) {
    if (!existing) return;

    Logger.info(
        `Handling sender side for transaction ${transaction.txHash} and wallet ${walletId}`,
    );

    await TransactionService.updateById(existing.id, {
        status: transaction.status,
        blockNumber: transaction.blockNumber,
        timestamp: transaction.timestamp,
    });

    await TransactionReceiptService.create({
        transactionId: existing.id,
        ...transaction.receipt,
    });
}

async function handleReceiver(
    walletId: string,
    existing: Transaction | null,
    transaction: HistoryResponse,
) {
    Logger.info(
        `Handling receiver side for transaction ${transaction.txHash} and wallet ${walletId}`,
    );

    if (existing) {
        await TransactionService.updateById(existing.id, {
            status: transaction.status,
            blockNumber: transaction.blockNumber,
            timestamp: transaction.timestamp,
        });
    } else {
        // No existing transaction, create a new one
        const tx = await prisma.transaction.upsert({
            where: {
                txHash_walletId: {
                    txHash: transaction.txHash,
                    walletId,
                },
            },
            create: {
                walletId,
                chainId: orcaProvider.chainId,
                txHash: transaction.txHash,
                type: transaction.type,
                assetType: transaction.assetType,
                fromAddress: transaction.fromAddress,
                toAddress: transaction.toAddress,
                valueRaw: transaction.valueRaw,
                valueFormatted: transaction.valueFormatted,
                status: transaction.status,
                blockNumber: transaction.blockNumber,
                timestamp: transaction.timestamp,
            },
            update: {
                status: transaction.status,
                blockNumber: transaction.blockNumber,
                timestamp: transaction.timestamp,
            },
        });
        await TransactionReceiptService.create({
            transactionId: tx.id,
            ...transaction.receipt,
        });
        await TokenService.createMany([
            ...transaction.transfers.map((transfer) => ({
                transactionId: tx.id,
                ...transfer,
            })),
        ]);
    }
}

async function handleWalletSide(
    context: WalletContext,
    t: TransactionResponse,
    isSender: boolean = false,
) {
    const { walletId, wallet, history } = context;

    const hash = t.hash.toLowerCase();
    const newTransaction = history.get(hash);

    if (!newTransaction) {
        Logger.warning(
            `Transaction ${hash} not found in history for wallet ${wallet.address}`,
        );
        return;
    }

    const isExisting = await prisma.transaction.findUnique({
        where: {
            txHash_walletId: {
                txHash: newTransaction.txHash,
                walletId,
            },
        },
    });

    if (isSender) {
        await handleSender(walletId, isExisting, newTransaction);
    } else {
        await handleReceiver(walletId, isExisting, newTransaction);
    }
}

async function handleTransaction(transactions: TransactionResponse[]) {
    const addresses = new Set<string>();

    for (const tx of transactions) {
        if (tx.from) addresses.add(tx.from.toLowerCase());
        if (tx.to) addresses.add(tx.to.toLowerCase());
    }

    if (addresses.size === 0) {
        return;
    }

    const wallets = await WalletService.getByPendingAddresses([...addresses]);

    if (!wallets || wallets.length === 0) {
        Logger.info(`No wallets found for addresses: ${[...addresses].join(", ")}`);
        return;
    }

    const walletMap = new Map<string, WalletContext>();

    for (const w of wallets) {
        const wallet = new OrcaWallet({
            provider: orcaProvider,
            mnemonic: w.encryptedMnemonic,
        });

        if (!wallet.privateKey || !wallet.address) {
            Logger.warning(`Failed to create wallet for address ${w.address}`);
            continue;
        }

        const history = await getHistory(wallet);

        walletMap.set(w.address.toLowerCase(), {
            walletId: w.id,
            wallet,
            history,
        });
    }

    const txs = new Map<string, TransactionResponse>();

    for (const tx of transactions) {
        if (!tx.hash) {
            Logger.warning(`Transaction missing hash: ${JSON.stringify(tx)}`);
            continue;
        }
        txs.set(tx.hash.toLowerCase(), tx);
    }

    const tasks = [];

    for (const tx of txs.values()) {
        const sender = tx.from ? walletMap.get(tx.from.toLowerCase()) : null;
        const receiver = tx.to ? walletMap.get(tx.to.toLowerCase()) : null;

        if (!sender && !receiver) continue;

        if (sender) {
            tasks.push(limiter(() => handleWalletSide(sender, tx, true)));
        }
        if (receiver) {
            tasks.push(limiter(() => handleWalletSide(receiver, tx, false)));
        }
    }

    await Promise.all(tasks);
}

async function handler(blockNumber: number) {
    try {
        const block = await orcaProvider.getBlock(blockNumber);

        if (!block) {
            Logger.warning(`Block ${blockNumber} not found`);
            return;
        }

        const txHashes = new Set(block.transactions);

        if (txHashes.size === 0) {
            Logger.info(`Block ${blockNumber} has no transactions`);
            return;
        } else {
            Logger.info(
                `Block ${blockNumber} has ${txHashes.size} transactions, checking for pending transactions...`,
            );
        }

        const pendingTxs = await TransactionService.getPendingTransactions([
            ...txHashes,
        ]);

        if (pendingTxs.length === 0) {
            Logger.info(`No pending transactions found in block ${blockNumber}`);
            return;
        }

        const matched = pendingTxs.filter((p) => txHashes.has(p.txHash));

        if (matched.length === 0) {
            Logger.info(`No pending transactions matched in block ${blockNumber}`);
            return;
        } else {
            console.log(util.inspect(matched, { depth: null, colors: true }));
        }

        const response = await Promise.all(
            matched.map((m) => orcaProvider.getTransaction(m.txHash)),
        );
        const transactions = response.filter(isTransactionResponse);

        if (transactions.length === 0) {
            Logger.info(`No valid transactions found in block ${blockNumber}`);
            return;
        }

        await handleTransaction(transactions);
    } catch (error) {
        Logger.error(error);
    }
}

export function blockListener() {
    orcaProvider.on("block", handler);
    return () => orcaProvider.off("block", handler);
}
