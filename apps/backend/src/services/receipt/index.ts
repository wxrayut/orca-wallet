import type { TransactionReceipt } from "@prisma/client";

import { prisma } from "../../lib";
import type { TransactionReceiptData, TransactionReceiptInclude } from "../../types";

// import { TransactionReceiptCache } from "./cache";

export class TransactionReceiptService {
    public static async create(data: TransactionReceiptData) {
        return prisma.transactionReceipt.create({ data });
    }
}
