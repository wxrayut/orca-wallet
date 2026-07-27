import Link from "next/link";

import { IconExternalLink } from "@tabler/icons-react";

import { ActivityTokenIcon } from "~/components/TokenIcon";
import { SubsectionTitle } from "~/components/primitives";
import { Separator } from "~/components/ui/separator";

import { formatAddress, getActivityMetadata } from "~/lib/utils";

import type { HistoryResponse } from "@orca-wallet/shared";

import ActivityRow from "./ActivityRow";
import ActivityStatus from "./ActivityStatus";

type ActivityDetailProps = {
    activity: HistoryResponse;
};

export default function ActivityDetail({ activity }: ActivityDetailProps) {
    const { isSend, symbol, title, sender, receiver, network, fee, date, txLink } =
        getActivityMetadata(activity);

    return (
        <>
            <div className="flex gap-4">
                <ActivityTokenIcon activity={activity} size={40} />
                <SubsectionTitle title={title} description={date} />
            </div>

            <Separator />

            <div className="flex h-32 items-center justify-center">
                <h2 className="truncate text-4xl font-medium">
                    {activity.valueFormatted} {symbol}
                </h2>
            </div>

            <Separator />

            <ActivityRow label={isSend ? "To" : "From"}>
                {isSend ? receiver : sender}
            </ActivityRow>

            <ActivityRow label="Transaction">
                {formatAddress(activity.txHash!)}
                <Link href={txLink} target="_blank">
                    <IconExternalLink className="text-muted-foreground" size={18} />
                </Link>
            </ActivityRow>
            <ActivityRow label="Network">{network}</ActivityRow>
            <ActivityRow label="Fee">{fee}</ActivityRow>
            <ActivityRow label="Submitted on">{date}</ActivityRow>
            <ActivityRow label="Status">
                <ActivityStatus status={activity.status} />
            </ActivityRow>
        </>
    );
}
