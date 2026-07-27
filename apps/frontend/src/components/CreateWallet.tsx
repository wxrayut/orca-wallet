"use client";

import { useState } from "react";

import { IconWallet } from "@tabler/icons-react";
import { toast } from "sonner";

import { Drawer, FloatingInput } from "~/components/primitives";
import { Label } from "~/components/ui/label";

import { useWallet } from "~/hooks";

import type { CreateWalletForm } from "@orca-wallet/shared";

type CreateWalletProps = {};

export function CreateWallet({}: CreateWalletProps) {
    const { wallets, createWallet, loading } = useWallet();

    const [form, setForm] = useState<CreateWalletForm>({
        label: `My Wallet ${wallets ? wallets.length + 1 : 1}`,
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, label: e.target.value }));
    };

    const onConfirm = async () => {
        toast.promise(createWallet(form), {
            loading: "Creating your wallet...",
            success: "Your wallet has been created successfully.",
            error: "We couldn’t create your wallet. Please try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    return (
        <Drawer
            triggerClassName="button-gradient hover:text-white rounded-lg"
            triggerContent={
                <>
                    <IconWallet size={16} />
                    <span>Create Wallet</span>
                </>
            }
            headerTitle="Create a new wallet"
            headerDescription="Create a new wallet to manage your crypto assets securely"
            confirmTriggerClassName="button-gradient text-white"
            confirmTriggerContent="Create Wallet"
            closerTriggerContent="Cancel"
            onConfirm={onConfirm}
            loading={loading}
        >
            <Label className="text-xs">Wallet Label (optional)</Label>

            <FloatingInput
                label=""
                className="mt-3"
                placeholder=""
                value={form.label}
                onChange={onChange}
            />
        </Drawer>
    );
}
