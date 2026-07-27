import { IconWallet } from "@tabler/icons-react";

import { AnimatedBorder, RadialNoise } from "~/components/decorative";

import type { Wallet } from "@orca-wallet/shared";

import CurrencySwitch from "./components/CurrencySwitch";
import WalletSelect from "./components/WalletSelect";

type ActiveWalletProps = {
    wallets: Wallet[];
    activeWallet: Wallet;
    setActiveWallet: (wallet: Wallet) => void;
};

export default function ActiveWallet({
    wallets,
    activeWallet,
    setActiveWallet,
}: ActiveWalletProps) {
    return (
        <AnimatedBorder>
            <div className="from-card to-muted/40 relative overflow-hidden rounded-lg border bg-linear-to-br p-5 shadow-md backdrop-blur">
                <RadialNoise />

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                                <IconWallet className="text-blue-500" size={24} />
                            </div>

                            <div>
                                <p className="text-muted-foreground flex items-center gap-2 text-xs md:text-sm">
                                    ACTIVE WALLET
                                    {activeWallet.isDefault && (
                                        <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                                    )}
                                </p>

                                <h3 className="mt-1 text-xs font-light md:text-sm">
                                    {activeWallet.label}
                                </h3>
                            </div>
                        </div>

                        <AnimatedBorder>
                            <WalletSelect
                                wallets={wallets}
                                activeWallet={activeWallet}
                                setActiveWallet={setActiveWallet}
                            />
                        </AnimatedBorder>
                    </div>

                    <div className="flex flex-col gap-2 rounded-md">
                        <div className="flex justify-between">
                            <p className="text-muted-foreground text-xs md:text-sm">
                                BALANCE
                            </p>

                            <p className="text-muted-foreground text-xs md:text-sm">
                                ETH
                            </p>
                        </div>

                        <h2 className="text-gradient text-xl font-normal md:text-2xl">
                            {activeWallet.balance}
                        </h2>

                        <div className="mt-2 flex w-full items-center gap-2">
                            <CurrencySwitch activeWallet={activeWallet} />
                            {/* <WalletRefresh activeWallet={activeWallet} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedBorder>
    );
}
