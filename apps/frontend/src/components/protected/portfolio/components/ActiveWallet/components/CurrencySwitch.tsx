import { useState } from "react";

import { Button } from "~/components/ui/button";

import { useCryptoPrice } from "~/hooks";

import { getWalletValue } from "~/lib/utils";

import type { CurrencyType, Wallet } from "@orca-wallet/shared";

type CurrencySwitchProps = {
    activeWallet: Wallet;
};

const SYMBOLS = ["ETH"];

export default function CurrencySwitch({ activeWallet }: CurrencySwitchProps) {
    const { prices } = useCryptoPrice(SYMBOLS);

    const [currency, setCurrency] = useState<CurrencyType>("usd");

    const ethValue = getWalletValue(prices, "ETH", currency, activeWallet.balance);

    const onClick = () => {
        setCurrency((prev) => (prev === "usd" ? "thb" : "usd"));
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            className="flex cursor-pointer items-center gap-2 rounded-md"
            onClick={onClick}
        >
            <span className="flex items-center">
                <span className="mt-1">≈</span>
            </span>

            <span>
                {ethValue} {currency.toUpperCase()}
            </span>
        </Button>
    );
}
