"use client";

import {
    IconClockBolt,
    IconTransfer,
    IconUserBolt,
    IconUsers,
    IconWallet,
} from "@tabler/icons-react";

import { SectionLayout } from "~/components/layouts";
import { SectionTitle, SubsectionTitle } from "~/components/primitives";
import { Loading } from "~/components/system";
import { Card } from "~/components/ui/card";

import { useAdmin, useAuth } from "~/hooks";

// import RecentTransactions from "./components/RecentTransactions";
import StatCard from "./components/StatCard";

export function Dashboard() {
    const { initializing } = useAuth();
    const { stats, recentTransactions } = useAdmin();

    if (initializing) return <Loading />;

    console.log(recentTransactions);

    return (
        <SectionLayout className="md:py-6">
            <SectionTitle
                title="Dashboard"
                description="Overview of users, wallets, and transactions."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={IconUsers}
                    title="Total Users"
                    value={stats.totalUsers}
                    trend={stats.userGrowthLastDay}
                />
                <StatCard
                    icon={IconUserBolt}
                    title="Active Users"
                    value={stats.activeUsers}
                />
                <StatCard
                    icon={IconWallet}
                    title="Total Wallets"
                    value={stats.totalWallets}
                />
                <StatCard
                    icon={IconTransfer}
                    title="Total Transactions"
                    value={stats.totalTransactions}
                />
            </div>

            <div className="mt-4">
                <SubsectionTitle
                    title="Transaction Tracking"
                    description="Track transaction status and processing activity across the platform."
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                    icon={IconTransfer}
                    iconColor="green"
                    title="Completed Transactions"
                    value={stats.completedTransactions}
                />
                <StatCard
                    icon={IconClockBolt}
                    iconColor="yellow"
                    title="Pending Transactions"
                    value={stats.pendingTransactions}
                />
                <StatCard
                    icon={IconTransfer}
                    iconColor="red"
                    title="Failed Transactions"
                    value={stats.failedTransactions}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-10">
                <div className="lg:col-span-6">
                    <Card className="h-full rounded-md"></Card>
                </div>
                <div className="lg:col-span-4">
                    <Card className="h-full rounded-md"></Card>
                </div>
            </div>
        </SectionLayout>
    );
}
