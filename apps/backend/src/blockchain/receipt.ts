import { TransactionStatus } from "@prisma/client";
import { ethers } from "ethers";

import type {
    Receipt,
    ReceiptOnConfirmedCallback,
    ReceiptOnFailedCallback,
} from "../types";

import type { OrcaProvider } from "./providers/provider";

export class OrcaReceipt {
    readonly provider: OrcaProvider;
    readonly hash: string;

    receipt?: Receipt;
    status: TransactionStatus = TransactionStatus.PENDING;
    error?: unknown;

    private confirmedCallbacks: ReceiptOnConfirmedCallback[] = [];
    private failedCallbacks: ReceiptOnFailedCallback[] = [];

    constructor(provider: OrcaProvider, hash: string) {
        this.provider = provider;
        this.hash = hash;
    }

    private cleanup() {
        this.confirmedCallbacks = [];
        this.failedCallbacks = [];
    }

    public get isPending() {
        return this.status === TransactionStatus.PENDING;
    }

    public get isConfirmed() {
        return this.status === TransactionStatus.COMPLETED;
    }

    public get isFailed() {
        return this.status === TransactionStatus.FAILED;
    }

    public onConfirmed(cb: ReceiptOnConfirmedCallback) {
        if (this.status === TransactionStatus.COMPLETED && this.receipt) {
            cb(this.receipt);
            return;
        }
        this.confirmedCallbacks.push(cb);
    }

    public onFailed(cb: ReceiptOnFailedCallback) {
        if (this.status === TransactionStatus.FAILED) {
            cb(this.error);
            return;
        }
        this.failedCallbacks.push(cb);
    }

    public async wait(confirmations = 1): Promise<Receipt> {
        try {
            const chainReceipt = await this.provider.waitForTransaction(
                this.hash,
                confirmations,
            );

            if (!chainReceipt || chainReceipt.status === 0) {
                throw new Error(`Transaction ${this.hash} failed or was reverted`);
            }

            const normalized = chainReceipt as Receipt;

            normalized.feeFormatted = chainReceipt.fee
                ? ethers.formatEther(chainReceipt.fee)
                : undefined;

            this.receipt = normalized;
            this.status = TransactionStatus.COMPLETED;

            for (const cb of this.confirmedCallbacks) {
                cb(normalized);
            }

            this.cleanup();

            return normalized;
        } catch (error) {
            this.status = TransactionStatus.FAILED;
            this.error = error;
            this.failedCallbacks.forEach((cb) => {
                cb(error);
            });

            throw error;
        }
    }
}
