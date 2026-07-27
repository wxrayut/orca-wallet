"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Drawer, SubsectionTitle } from "~/components/primitives";
import { Input } from "~/components/ui/input";

import { useWallet } from "~/hooks";

type WalletRemoveProps = {
    walletId: string;
    label: string;
};

export default function WalletRemove({ walletId, label }: WalletRemoveProps) {
    const { deleteWallet } = useWallet();

    const [confirmRemoval, setConfirmRemoval] = useState("");

    const onConfirm = async () => {
        if (!walletId) return;

        if (confirmRemoval !== label) {
            toast.error("", {
                description: "",
                position: "top-center",
            });
            return;
        }

        toast.promise(deleteWallet({ walletId }), {
            loading: "Removing your wallet...",
            success: () => {
                setConfirmRemoval("");
                return "Your wallet has been removed.";
            },
            error: "We couldn’t remove your wallet. Please try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    return (
        <div className="mb-6 space-y-2">
            <SubsectionTitle
                title="Remove Wallet"
                description="Remove this wallet from your account. This action cannot be undone, make sure you have backed up your private key."
                separated={false}
            />

            <Drawer
                triggerVariant="destructive"
                triggerClassName="rounded-lg"
                triggerContent="Remove Wallet"
                headerTitle="Remove Wallet"
                headerDescription={`Are you sure you want to remove this wallet?, Type '${label}' to confirm.`}
                confirmTriggerClassName="bg-destructive text-white"
                confirmTriggerContent="Remove"
                onConfirm={onConfirm}
            >
                <Input
                    value={confirmRemoval}
                    onChange={(e) => setConfirmRemoval(e.target.value)}
                    className="rounded-md"
                />
            </Drawer>
        </div>
    );
}
