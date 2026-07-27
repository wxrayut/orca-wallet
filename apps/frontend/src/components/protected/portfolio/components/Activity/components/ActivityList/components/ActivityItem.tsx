"use client";

import { IconChevronRight, IconHandClick } from "@tabler/icons-react";

import { ActivityTokenIcon } from "~/components/TokenIcon";
import { Dialog, Drawer } from "~/components/primitives";

import { useResponsive } from "~/hooks/system/client";

import { cn, formatAddress, getActivityMetadata } from "~/lib/utils";

import type { HistoryResponse } from "@orca-wallet/shared";

import ActivityDetail from "./ActivityDetail";
import ActivityStatus from "./ActivityStatus";

type ActivityItemProps = {
    activity: HistoryResponse;
};

export default function ActivityItem({ activity }: ActivityItemProps) {
    const { isDesktop } = useResponsive();
    const { isSend, title, symbol, date } = getActivityMetadata(activity);

    const triggerContent = (
        <div className="flex w-full items-center justify-between overflow-hidden rounded-xl px-3 py-2">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <ActivityTokenIcon activity={activity} size={40} />

                <div className="flex flex-col items-start justify-center gap-1">
                    <span
                        className={cn(
                            "text-sm font-medium",
                            isSend ? "text-red-400" : "text-green-400",
                        )}
                    >
                        {isSend ? "Sent" : "Received"}
                    </span>

                    <span className="text-muted-foreground text-xs">
                        {activity.valueFormatted} {symbol}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 md:hidden">
                <IconChevronRight className="text-muted-foreground" />
            </div>

            <div className="hidden w-full flex-1 items-center justify-end gap-6 md:flex">
                <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs font-medium">
                        {isSend ? "To" : "From"}
                    </span>

                    <span className="text-xs">
                        {formatAddress(activity.toAddress!)}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs">Time</span>

                    <span className="text-xs">{date}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs">Status</span>

                    <ActivityStatus status={activity.status} />
                </div>
            </div>
        </div>
    );

    return isDesktop ? (
        <Dialog
            triggerClassName="w-full h-[64px] rounded-xl mb-2"
            triggerContent={triggerContent}
            headerTitle={title}
            headerDescription="View detailed information about this activity."
            disableFooter
        >
            <ActivityDetail activity={activity} />
        </Dialog>
    ) : (
        <Drawer
            triggerClassName="w-full h-[64px] rounded-xl mb-2"
            triggerContent={triggerContent}
            headerTitle={title}
            headerDescription="View detailed information about this activity."
            disableConfirm
        >
            <ActivityDetail activity={activity} />
        </Drawer>
    );
}
