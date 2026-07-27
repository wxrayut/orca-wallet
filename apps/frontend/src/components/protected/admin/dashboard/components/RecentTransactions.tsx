import {
    IconArrowDownLeft,
    IconArrowUpRight,
    IconCircleDashedCheck,
    IconCircleDashedX,
    IconDownload,
    IconSend,
} from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";

import { cn, formatAddress, formatDate } from "~/lib/utils";

import {
    type TransactionResponse,
    TransactionStatus,
    TransactionType,
} from "@orca-wallet/shared";

type RecentTransactionsProps = {
    transactions: TransactionResponse[];
};

const statusConfig = {
    COMPLETED: {
        icon: IconCircleDashedCheck,
        label: "Completed",
        className: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    PENDING: {
        icon: Spinner,
        label: "Pending",
        className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    FAILED: {
        icon: IconCircleDashedX,
        label: "Failed",
        className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
} as const;

export default function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    return (
        <Card className="rounded-md">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {transactions.slice(0, 6).map((tx) => {
                    const isSend = tx.type === TransactionType.SEND;
                    const symbol = tx.transfers[0].symbol;
                    const {
                        icon: StatusIcon,
                        label,
                        className,
                    } = statusConfig[tx.status];

                    return (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full",
                                        className,
                                    )}
                                >
                                    {tx.status === TransactionStatus.PENDING ? (
                                        <StatusIcon />
                                    ) : isSend ? (
                                        <IconSend size={16} />
                                    ) : (
                                        <IconDownload size={16} />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between gap-1">
                                        <span className="font-medium">
                                            {isSend ? "Sent" : "Received"}
                                        </span>
                                    </div>

                                    <div className="text-muted-foreground text-xs">
                                        {formatAddress(
                                            isSend && tx.toAddress
                                                ? tx.toAddress
                                                : tx.fromAddress,
                                            6,
                                            12,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-semibold">
                                    {tx.valueFormatted} {symbol}
                                </div>

                                <div className="text-muted-foreground text-xs">
                                    {formatDate(tx.createdAt)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
