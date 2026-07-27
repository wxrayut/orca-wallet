import { IconWallet } from "@tabler/icons-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

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
    const onValueChange = (value: string) => {
        const selected = wallets.find((wallet) => wallet.id === value);

        if (!selected) return;

        setActiveWallet(selected);
    };

    return (
        <Select value={activeWallet.id} onValueChange={onValueChange}>
            <SelectTrigger className="w-full cursor-pointer rounded-md md:w-80">
                <SelectValue />
            </SelectTrigger>

            <SelectContent position="popper" className="mt-2 max-h-100 rounded-md">
                {wallets.map((wallet) => (
                    <SelectItem
                        key={wallet.id}
                        value={wallet.id}
                        className="cursor-pointer"
                    >
                        <IconWallet size={16} />
                        {wallet.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
