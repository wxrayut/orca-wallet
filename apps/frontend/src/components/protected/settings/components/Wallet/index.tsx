"use client";

import { useState } from "react";

import { CreateWallet } from "~/components/CreateWallet";
import { EmptyWallet } from "~/components/EmptyWallet";
import { ImportWallet } from "~/components/ImportWallet";
import { SectionLayout } from "~/components/layouts";
import { SectionTitle, SubsectionTitle } from "~/components/primitives";
import { ScrollArea } from "~/components/ui/scroll-area";

import { useActiveWallet, useWallet } from "~/hooks";

import type { Wallet as W } from "@orca-wallet/shared";

import WalletAddress from "./components/WalletAddress";
import WalletDefault from "./components/WalletDefault";
import WalletLabel from "./components/WalletLabel";
import WalletPrivateKey from "./components/WalletPrivateKey";
import WalletRemove from "./components/WalletRemove";
import WalletSelect from "./components/WalletSelect";

export default function Wallet() {
    const { wallets } = useWallet();

    const [selectedWallet, setSelectedWallet] = useState<W | null>(null);

    const activeWallet = useActiveWallet(wallets, selectedWallet);

    return (
        <SectionLayout reset>
            <SectionTitle
                title="Wallet Settings"
                description="Manage your wallet settings. Remove connected wallets or update wallet preferences."
                separated
            />

            {activeWallet ? (
                <div className="flex flex-col gap-4">
                    <SubsectionTitle
                        title="Active Wallet"
                        description="Select the wallet you want to view and manage."
                        separated={false}
                    />

                    <WalletSelect
                        activeWallet={activeWallet}
                        wallets={wallets}
                        setActiveWallet={setSelectedWallet}
                    />

                    <ScrollArea className="md:h-120">
                        <WalletLabel
                            walletId={activeWallet.id}
                            label={activeWallet.label}
                        />
                        <WalletAddress address={activeWallet.address} />
                        <WalletDefault
                            walletId={activeWallet.id}
                            isDefault={activeWallet.isDefault}
                        />
                        <WalletPrivateKey walletId={activeWallet.id} />
                        <WalletRemove
                            walletId={activeWallet.id}
                            label={activeWallet.label}
                        />
                    </ScrollArea>
                </div>
            ) : (
                <EmptyWallet>
                    <ImportWallet />
                    <CreateWallet />
                </EmptyWallet>
            )}
        </SectionLayout>
    );
}
