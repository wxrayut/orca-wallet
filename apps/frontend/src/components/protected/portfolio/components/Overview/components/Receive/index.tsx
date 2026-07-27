"use client";

import { IconDownload } from "@tabler/icons-react";

import { ActionTrigger } from "~/components/ActionTrigger";
import { Dialog, Drawer } from "~/components/primitives";

import { useCopy, useResponsive } from "~/hooks/system/client";

import type { Wallet } from "@orca-wallet/shared";

import ReceiveContent from "./components/ReceiveContent";

type ReceiveProps = {
    activeWallet?: Wallet | null;
};

export default function Receive({ activeWallet }: ReceiveProps) {
    const address = activeWallet?.address || "";

    const { isCopied, copyToClipboard } = useCopy(address);
    const { isDesktop } = useResponsive();

    const disableTrigger = !activeWallet;
    const triggerContent = <ActionTrigger icon={<IconDownload />} label="Receive" />;

    return isDesktop ? (
        <Dialog
            triggerClassName="button-gradient hover:text-white rounded-lg w-full"
            disableTrigger={disableTrigger}
            triggerContent={triggerContent}
            headerTitle="Receive Crypto"
            headerDescription="Share your wallet address to receive crypto."
            disableFooter
        >
            <ReceiveContent
                address={address}
                isCopied={isCopied}
                copyToClipboard={copyToClipboard}
            />
        </Dialog>
    ) : (
        <Drawer
            triggerClassName="button-gradient hover:text-white rounded-lg w-full"
            disableTrigger={disableTrigger}
            triggerContent={triggerContent}
            headerTitle="Receive Crypto"
            headerDescription="Share your wallet address to receive crypto."
            disableConfirm
        >
            <ReceiveContent
                address={address}
                isCopied={isCopied}
                copyToClipboard={copyToClipboard}
            />
        </Drawer>
    );
}
