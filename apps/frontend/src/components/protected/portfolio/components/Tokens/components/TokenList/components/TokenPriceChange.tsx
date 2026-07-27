import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

import { cn } from "~/lib/utils";

type TokenPriceChangeProps = {
    value: number;
    showIcon?: boolean;
    className?: string;
};

export default function TokenPriceChange({
    value,
    showIcon = true,
    className,
}: TokenPriceChangeProps) {
    const positive = value >= 0;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                positive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400",
                className,
            )}
        >
            {showIcon &&
                (positive ? (
                    <IconArrowUpRight size={14} />
                ) : (
                    <IconArrowDownRight size={14} />
                ))}
            {positive ? "+" : "-"}
            {Math.abs(value).toFixed(2)}%
        </div>
    );
}
