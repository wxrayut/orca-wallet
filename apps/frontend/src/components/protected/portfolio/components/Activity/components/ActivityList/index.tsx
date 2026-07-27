import { ScrollArea } from "~/components/ui/scroll-area";

import type { HistoryResponse } from "@orca-wallet/shared";

import ActivityItem from "./components/ActivityItem";

type ActivityListProps = {
    activities: HistoryResponse[];
};

export default function ActivityList({ activities }: ActivityListProps) {
    return (
        <ScrollArea className="flex gap-2 md:h-120">
            {activities.map((activity) => (
                <ActivityItem key={activity.txHash} activity={activity} />
            ))}
        </ScrollArea>
    );
}
