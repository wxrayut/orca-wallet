"use client";

import { useEffect, useState } from "react";

import { CreateWallet } from "~/components/CreateWallet";
import { EmptyWallet } from "~/components/EmptyWallet";
import { ImportWallet } from "~/components/ImportWallet";
import { SectionLayout } from "~/components/layouts";
import { Loading } from "~/components/system";

import { useActiveWallet, useAuth, useSyncWallet, useWallet } from "~/hooks";

import type { Wallet } from "@orca-wallet/shared";

import ActiveWallet from "./components/ActiveWallet";
import Activity from "./components/Activity";
import Overview from "./components/Overview";
import Tabs from "./components/Tabs";
import Tokens from "./components/Tokens";

export function Portfolio() {
    const { user, initializing } = useAuth();
    const { wallets, loading, loadWallets } = useWallet();

    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    useEffect(() => {
        if (user) {
            loadWallets();
        }
    }, [user, loadWallets]);

    const activeWallet = useActiveWallet(wallets, selectedWallet);

    // Sync wallet data whenever the active wallet changes
    useSyncWallet(activeWallet);

    if (initializing || loading) return <Loading />;
    if (!user) return null;
    if (!wallets) return null;

    return (
        <SectionLayout className="w-full py-6 md:py-6">
            <div className="flex flex-col gap-4">
                {!activeWallet ? (
                    <EmptyWallet>
                        <CreateWallet />
                        <ImportWallet />
                    </EmptyWallet>
                ) : (
                    <ActiveWallet
                        wallets={wallets}
                        activeWallet={activeWallet}
                        setActiveWallet={setSelectedWallet}
                    />
                )}

                <Tabs tabs={tabs}>
                    <Overview activeWallet={activeWallet} />
                    <Tokens />
                    <Activity />
                </Tabs>
            </div>
        </SectionLayout>
    );
}

const tabs = [
    {
        label: "Overview",
        value: "overview",
    },
    {
        label: "Tokens",
        value: "tokens",
    },
    {
        label: "Activity",
        value: "activity",
    },
];
