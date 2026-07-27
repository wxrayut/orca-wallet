import {
    IconCashBanknoteMinus,
    IconCashBanknotePlus,
    IconClock,
    IconDownload,
    IconList,
    IconRefresh,
    IconSend,
} from "@tabler/icons-react";

import { ActionTrigger } from "~/components/ActionTrigger";
import { Drawer } from "~/components/primitives";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "~/components/ui/select";

import { useResponsive } from "~/hooks/system/client";

import { cn } from "~/lib/utils";

export enum Filter {
    All = "all",
    Send = "send",
    Pending = "pending",
    Receive = "receive",
    Swap = "swap",
    Deposit = "deposit",
    Withdrawal = "withdrawal",
}

type ActivityFilterProps = {
    filter: Filter;
    setFilter: (filter: Filter) => void;
};

export default function ActivityFilter({ filter, setFilter }: ActivityFilterProps) {
    const { isDesktop } = useResponsive();

    const currentFilter = filters.find((f) => f.value === filter);
    const triggerContent = (
        <ActionTrigger
            icon={currentFilter?.icon && <currentFilter.icon />}
            label={currentFilter?.label || "Filter"}
        />
    );

    return isDesktop ? (
        <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <SelectTrigger className="w-40 cursor-pointer rounded-lg">
                {triggerContent}
            </SelectTrigger>

            <SelectContent position="popper" className="rounded-lg">
                {filters.map((f) => (
                    <SelectItem
                        key={f.value}
                        value={f.value}
                        className="cursor-pointer rounded-lg"
                    >
                        <f.icon />
                        {f.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ) : (
        <Drawer
            triggerClassName="rounded-lg w-32 items-center bg-background justify-between"
            headerTitle="Filter activities"
            headerDescription="Choose a filter to narrow down the activities shown in your history."
            triggerContent={triggerContent}
            disableConfirm
        >
            <ScrollArea className="flex h-70 flex-col gap-2 md:h-75">
                {filters.map((f) => {
                    const isActive = filter === f.value;

                    return (
                        <div
                            key={f.value}
                            onClick={() => setFilter(f.value as Filter)}
                            className={cn(
                                "group mt-2 flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all",
                                "hover:bg-muted/50",
                                isActive
                                    ? "bg-primary/5 border-blue-500"
                                    : "border-border",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg",
                                        isActive
                                            ? "bg-blue-500/10 text-blue-500"
                                            : "bg-muted",
                                    )}
                                >
                                    <f.icon
                                        className={cn(
                                            "h-4 w-4",
                                            isActive
                                                ? "text-blue-500"
                                                : "text-muted-foreground",
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-light">
                                        {f.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </ScrollArea>
        </Drawer>
    );
}

const filters = [
    {
        icon: IconList,
        label: "All types",
        value: Filter.All,
    },
    {
        icon: IconSend,
        label: "Sends",
        value: Filter.Send,
    },
    {
        icon: IconClock,
        label: "Pendings",
        value: Filter.Pending,
    },
    {
        icon: IconDownload,
        label: "Receives",
        value: Filter.Receive,
    },
    {
        icon: IconRefresh,
        label: "Swaps",
        value: Filter.Swap,
    },
    {
        icon: IconCashBanknotePlus,
        label: "Deposits",
        value: Filter.Deposit,
    },
    {
        icon: IconCashBanknoteMinus,
        label: "Withdrawals",
        value: Filter.Withdrawal,
    },
];
