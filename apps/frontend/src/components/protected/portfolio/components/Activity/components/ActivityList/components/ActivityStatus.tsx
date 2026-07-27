import { IconCircleDashedCheck, IconCircleDashedX } from "@tabler/icons-react";

import { Spinner } from "~/components/ui/spinner";

import { cn } from "~/lib/utils";

import { TransactionStatus } from "@orca-wallet/shared";

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

type ActivityStatusProps = {
    status: TransactionStatus;
};

export default function ActivityStatus({ status }: ActivityStatusProps) {
    const { icon: StatusIcon, label, className } = statusConfig[status];

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                className,
            )}
        >
            <StatusIcon className="mr-1" />
            <span className="ml-1">{label}</span>
        </div>
    );
}
