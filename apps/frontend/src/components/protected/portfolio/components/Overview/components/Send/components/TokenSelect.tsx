"use client";

import { IconChevronDown } from "@tabler/icons-react";

import { TokenIcon } from "~/components/TokenIcon";
import { Dialog, Drawer } from "~/components/primitives";

import { useResponsive } from "~/hooks/system/client";

import { getTokenMetada } from "~/lib/utils";

import type { NativeBalance, TokenBalance } from "@orca-wallet/shared";

import TokenContent from "./TokenContent";

type TokenSelectProps = {
    tokens: (NativeBalance | TokenBalance)[];
    selectedToken: NativeBalance | TokenBalance;
    setSelectedToken: (token: NativeBalance | TokenBalance) => void;
};

export default function TokenSelect({
    tokens,
    selectedToken,
    setSelectedToken,
}: TokenSelectProps) {
    const { isDesktop } = useResponsive();
    const { name } = getTokenMetada(selectedToken);

    const triggerContent = (
        <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <TokenIcon token={selectedToken} size={30} />

                <div className="text-left">
                    <p className="text-sm">{name}</p>
                    <p className="text-muted-foreground text-xs">
                        {selectedToken.balance}
                    </p>
                </div>
            </div>

            <IconChevronDown />
        </div>
    );
    const content = (
        <TokenContent
            tokens={tokens}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
        />
    );

    return isDesktop ? (
        <Dialog
            triggerClassName="w-full justify-between py-8 rounded-b-lg"
            triggerContent={triggerContent}
            headerTitle="Select a token"
            headerDescription="Choose a token to send from your wallet."
            disableFooter
        >
            {content}
        </Dialog>
    ) : (
        <Drawer
            triggerClassName="w-full justify-between py-8 rounded-b-lg"
            triggerContent={triggerContent}
            headerTitle="Select a token"
            headerDescription="Choose a token to send from your wallet."
            disableFooter
        >
            {content}
        </Drawer>
    );
}
