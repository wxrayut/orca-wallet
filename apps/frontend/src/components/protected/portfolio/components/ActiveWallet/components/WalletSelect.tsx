import { IconChevronDown, IconWallet } from "@tabler/icons-react";

import { Drawer } from "~/components/primitives";
import { ScrollArea } from "~/components/ui/scroll-area";

import { cn, formatAddress } from "~/lib/utils";

import type { Wallet } from "@orca-wallet/shared";

type WalletSelectProps = {
    wallets: Wallet[];
    activeWallet: Wallet;
    setActiveWallet: (wallet: Wallet) => void;
};

export default function WalletSelect({
    wallets,
    activeWallet,
    setActiveWallet,
}: WalletSelectProps) {
    return (
        <Drawer
            triggerVariant="ghost"
            triggerClassName="rounded-md border border-muted bg-transparent px-3 py-1 text-xs font-light hover:bg-muted/50"
            triggerContent={
                <div className="flex justify-between gap-2 font-light">
                    <span className="w-full text-left">Switch</span>
                    <IconChevronDown />
                </div>
            }
            headerTitle="Select Wallet"
            headerDescription="Choose a wallet to view its portfolio and activity."
            disableConfirm
            closerTriggerContent="Cancel"
        >
            <ScrollArea className="flex h-70 flex-col gap-2 md:h-75">
                {wallets.map((wallet) => {
                    const isActive = wallet.id === activeWallet.id;

                    return (
                        <div
                            key={wallet.id}
                            onClick={() => setActiveWallet(wallet)}
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
                                    <IconWallet
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
                                        {wallet.label || "Unnamed Wallet"}
                                    </span>

                                    <span className="text-muted-foreground text-xs">
                                        {formatAddress(wallet.address, 10)}
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
