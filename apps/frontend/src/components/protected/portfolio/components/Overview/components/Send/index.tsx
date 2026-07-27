"use client";

import { useEffect, useState } from "react";

import { IconSend } from "@tabler/icons-react";
import { toast } from "sonner";

import { ActionTrigger } from "~/components/ActionTrigger";
import { Dialog, Drawer } from "~/components/primitives";

import { useWallet } from "~/hooks";
import { useResponsive } from "~/hooks/system/client";

import {
    AssetType,
    type NativeBalance,
    type SendCryptoForm,
    type TokenBalance,
    type Wallet,
} from "@orca-wallet/shared";

import SendContent from "./components/SendContent";
import TokenSelect from "./components/TokenSelect";

type SendProps = {
    activeWallet?: Wallet | null;
};

export default function Send({ activeWallet }: SendProps) {
    const { balance, tokens, sendCrypto, sendLoading } = useWallet();
    const { isDesktop } = useResponsive();

    const [selectedToken, setSelectedToken] = useState<NativeBalance | TokenBalance>(
        balance || tokens[0],
    );
    const [form, setForm] = useState<SendCryptoForm>({
        type: AssetType.NATIVE,
        walletId: "",
        symbol: "",
        amount: "",
        toAddress: "",
    });

    useEffect(() => {
        if (!activeWallet) return;

        setForm((prev) => ({
            ...prev,
            walletId: activeWallet.id,
        }));
    }, [activeWallet]);

    useEffect(() => {
        if (!balance) return;

        setSelectedToken(balance);
    }, [balance]);

    useEffect(() => {
        if (!selectedToken) return;

        const isNative = selectedToken.kind === AssetType.NATIVE;
        const type = isNative ? AssetType.NATIVE : AssetType.TOKEN;
        const symbol = isNative ? "ETH" : selectedToken.symbol;

        setForm((prev) => ({
            ...prev,
            type,
            symbol,
        }));
    }, [selectedToken]);

    const clearForm = () => {
        setForm((prev) => ({
            ...prev,
            amount: "",
            toAddress: "",
        }));
    };

    const onConfirm = () => {
        toast.promise(sendCrypto(form), {
            loading: `Sending ${form.amount} ${form.symbol}...`,
            success: () => {
                clearForm();
                return "Your transaction has been sent. Waiting for confirmation.";
            },
            error: (error: Error) =>
                error.message ||
                "We couldn’t send your transaction. Please try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    const combinedTokens = balance ? [balance, ...tokens] : tokens;
    const disableTrigger = !activeWallet;
    const triggerContent = <ActionTrigger icon={<IconSend />} label="Send" />;
    const content = (
        <SendContent
            token={selectedToken}
            form={form}
            setForm={setForm}
            onConfirm={onConfirm}
            loading={sendLoading}
        >
            <TokenSelect
                tokens={combinedTokens}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
            />
        </SendContent>
    );

    return isDesktop ? (
        <Dialog
            triggerClassName="button-gradient hover:text-white rounded-lg w-full"
            disableTrigger={disableTrigger}
            triggerContent={triggerContent}
            headerTitle="Send Crypto"
            headerDescription="Send crypto to another wallet."
            disableFooter
        >
            {content}
        </Dialog>
    ) : (
        <Drawer
            triggerClassName="button-gradient hover:text-white rounded-lg w-full"
            disableTrigger={disableTrigger}
            triggerContent={triggerContent}
            headerTitle="Send Crypto"
            headerDescription="Send crypto to another wallet."
            disableFooter
        >
            {content}
        </Drawer>
    );
}
