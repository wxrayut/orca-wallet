"use client";

import { useEffect, useState } from "react";

import { IconCheck, IconCopy, IconEye } from "@tabler/icons-react";
import { toast } from "sonner";

import { SubsectionTitle } from "~/components/primitives";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { useWallet } from "~/hooks";
import { useCopy } from "~/hooks/system/client";

import { formatAddress } from "~/lib/utils";

type WalletPrivateKeyProps = {
    walletId: string;
};

const TIMEOUT_DURATION = 5000; // 5 seconds

export default function WalletPrivateKey({ walletId }: WalletPrivateKeyProps) {
    const { loadPrivateKey } = useWallet();

    const [privateKey, setPrivateKey] = useState("");
    const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
    const [countdown, setCountdown] = useState(TIMEOUT_DURATION / 1000);

    const { isCopied, copyToClipboard } = useCopy(privateKey);

    useEffect(() => {
        if (!isPrivateKeyVisible) return;

        setCountdown(TIMEOUT_DURATION / 1000);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const timeout = setTimeout(() => {
            setPrivateKey("");
            setIsPrivateKeyVisible(false);
            setCountdown(TIMEOUT_DURATION / 1000);
        }, TIMEOUT_DURATION);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isPrivateKeyVisible]);

    const onClick = async () => {
        if (!walletId) return;

        toast.promise(loadPrivateKey({ walletId }), {
            loading: "Decrypting your private key...",
            success: (key: string) => {
                setPrivateKey(key);
                setIsPrivateKeyVisible(true);
                return "Your private key is now visible.";
            },
            error: "We couldn't retrieve your private key. Please try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    return (
        <div className="mb-6 space-y-2">
            <SubsectionTitle
                title="Wallet Private Key"
                description="Your private key is encrypted and securely stored."
                separated={false}
            />

            <div className="flex gap-2">
                <Input
                    value={
                        isPrivateKeyVisible
                            ? formatAddress(privateKey, 32, 4, "... ")
                            : "••••••••••••••••••••••••••••••"
                    }
                    disabled
                    className="max-w-sm rounded-md opacity-70"
                />

                <Button
                    variant="outline"
                    className="ml-2 cursor-pointer rounded-md"
                    onClick={onClick}
                >
                    {isPrivateKeyVisible ? (
                        countdown > 0 ? (
                            `${countdown}s`
                        ) : (
                            <IconEye size={16} />
                        )
                    ) : (
                        <IconEye size={16} />
                    )}
                </Button>

                <Button
                    variant="outline"
                    className="ml-2 cursor-pointer rounded-md"
                    onClick={copyToClipboard}
                    disabled={!isPrivateKeyVisible}
                >
                    {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </Button>
            </div>
        </div>
    );
}
