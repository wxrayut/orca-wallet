import pLimit from "p-limit";

// Limit concurrent processing of transactions to avoid overwhelming the system
export const limiter = pLimit(2);
