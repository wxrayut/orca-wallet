"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";

import { SubsectionTitle } from "~/components/primitives";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { useCopy } from "~/hooks/system/client";

type WalletAddressProps = {
    address: string;
};

export default function WalletAddress({ address }: WalletAddressProps) {
    const { isCopied, copyToClipboard } = useCopy(address);

    return (
        <div className="mb-4 space-y-2">
            <SubsectionTitle
                title="Wallet Address"
                description="Your wallet address is used to receive funds."
                separated={false}
            />

            <div className="flex gap-2">
                <Input
                    value={address}
                    disabled
                    className="max-w-sm rounded-md opacity-70"
                />

                <Button
                    variant="outline"
                    className="ml-2 cursor-pointer rounded-md"
                    onClick={copyToClipboard}
                >
                    {isCopied ? <IconCheck /> : <IconCopy />}
                </Button>
            </div>
        </div>
    );
}
