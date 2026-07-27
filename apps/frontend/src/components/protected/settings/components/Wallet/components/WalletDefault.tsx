"use client";

import { toast } from "sonner";

import { SubsectionTitle } from "~/components/primitives";
import { Switch } from "~/components/ui/switch";

import { useWallet } from "~/hooks";

type DefaultUpdateProps = {
    walletId: string;
    isDefault: boolean;
};

export default function WalletDefault({ walletId, isDefault }: DefaultUpdateProps) {
    const { updateDefault } = useWallet();

    const onCheckedChange = async (checked: boolean) => {
        if (!walletId) return;

        toast.promise(updateDefault({ walletId, isDefault: !isDefault }), {
            loading: "Update your default wallet...",
            success: !isDefault
                ? "This wallet is now set as your default wallet."
                : "This wallet is no longer your default wallet.",
            error: "We couldn’t update your default wallet. Please try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    return (
        <div className="mb-4 space-y-2">
            <SubsectionTitle
                title="Set Default Wallet"
                description="Set this wallet as your default wallet for transactions and receiving funds."
                separated={false}
            />

            <Switch
                className="cursor-pointer"
                checked={!!isDefault}
                onCheckedChange={onCheckedChange}
            />
        </div>
    );
}
