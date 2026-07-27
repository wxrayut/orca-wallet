"use client";

import { useMemo, useState } from "react";

import { SubsectionTitle } from "~/components/primitives";
import { Separator } from "~/components/ui/separator";
import { TabsContent } from "~/components/ui/tabs";

import { useWallet } from "~/hooks";

import { TransactionStatus } from "@orca-wallet/shared";

import ActivityFilter, { Filter } from "./components/ActivityFilter";
import ActivityList from "./components/ActivityList";

type ActivityProps = {};

export default function Activity({}: ActivityProps) {
    const { activities } = useWallet();

    const [filter, setFilter] = useState(Filter.All);

    const filtered = useMemo(() => {
        if (!activities) return [];
        if (filter === Filter.All) {
            return activities;
        }
        return activities.filter((item) => {
            const target = item.type.toLowerCase();
            const isMatched = target === filter.toLowerCase();

            if (filter === Filter.Pending) {
                return item.status === TransactionStatus.PENDING;
            }
            if (filter === Filter.Send || filter === Filter.Receive) {
                return isMatched && item.status === TransactionStatus.COMPLETED;
            }

            return isMatched;
        });
    }, [activities, filter]);

    return (
        <TabsContent value="activity">
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <SubsectionTitle
                        title="Activity"
                        description="Review your recent transactions and activities."
                    />

                    <ActivityFilter filter={filter} setFilter={setFilter} />
                </div>

                <Separator />

                <div className="mt-4">
                    <ActivityList activities={filtered} />
                </div>
            </div>
        </TabsContent>
    );
}
