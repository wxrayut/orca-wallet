"use client";

import { useEffect, useState } from "react";

import { IconPencilCheck } from "@tabler/icons-react";
import { toast } from "sonner";

import { SubsectionTitle } from "~/components/primitives";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { useWallet } from "~/hooks";

type LabelUpdateProps = {
    walletId: string;
    label: string;
};

export default function WalletLabel({ walletId, label }: LabelUpdateProps) {
    const { updateLabel } = useWallet();

    const [currentLabel, setCurrentLabel] = useState(label);

    useEffect(() => {
        setCurrentLabel(label);
    }, [label]);

    const onChange = (value: string) => {
        setCurrentLabel(value);
    };

    const onClick = async () => {
        if (!walletId) return;

        if (currentLabel === label) {
            toast.error("No Changes Detected", {
                description: "Please make changes to the label before saving.",
                duration: 1000,
                position: "top-center",
            });
            return;
        }

        if (currentLabel.trim() === "") {
            toast.error("Invalid Wallet Label", {
                description: "Wallet label cannot be empty.",
                duration: 1000,
                position: "top-center",
            });
            return;
        }

        toast.promise(updateLabel({ walletId, label: currentLabel }), {
            loading: "Updating your wallet label...",
            success: "Your wallet label has been updated.",
            error: "We couldn’t update your wallet label. Please try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    return (
        <div className="mb-4 space-y-2">
            <SubsectionTitle
                title="Wallet Label"
                description="You can change the label for your active wallet."
                separated={false}
            />

            <div className="flex gap-2">
                <Input
                    value={currentLabel}
                    className="max-w-sm rounded-md"
                    onChange={(e) => onChange(e.target.value)}
                />

                <Button
                    variant="outline"
                    className="ml-2 cursor-pointer rounded-md"
                    onClick={onClick}
                >
                    <IconPencilCheck />
                </Button>
            </div>
        </div>
    );
}
