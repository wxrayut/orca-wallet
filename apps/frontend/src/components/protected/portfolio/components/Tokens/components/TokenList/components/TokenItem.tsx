import { IconChevronRight } from "@tabler/icons-react";

import { TokenIcon } from "~/components/TokenIcon";
import { Drawer } from "~/components/primitives";

import { useResponsive } from "~/hooks/system/client";

import { PriceItem, TokenBalance } from "@orca-wallet/shared";

import TokenPriceChange from "./TokenPriceChange";
import TokenRow from "./TokenRow";

type TokenItemProps = {
    token: TokenBalance;
    price: PriceItem;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
}

function formatCompact(value: number) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value);
}

export default function TokenItem({ token, price }: TokenItemProps) {
    const { isDesktop } = useResponsive();

    const tokenBalance = parseFloat(token.balance ?? "0.0");
    const usd = tokenBalance * price.usd;

    const triggerContent = (
        <div className="flex w-full items-center justify-between overflow-hidden rounded-xl px-3 py-2">
            <div className="flex min-w-0 items-center justify-between gap-3">
                <TokenIcon token={token} size={40} />

                <div className="gap-1j flex flex-col justify-center">
                    <h3 className="truncate text-left text-base font-semibold text-white">
                        {price.symbol}
                    </h3>

                    <TokenPriceChange value={price.usd_24h_change} />
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 md:hidden">
                <IconChevronRight className="text-muted-foreground" />
            </div>

            <div className="hidden w-full flex-1 items-center justify-end gap-6 md:flex">
                <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs">Holdings</span>
                    <span className="text-xs">
                        {formatCurrency(tokenBalance)} {price.symbol}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs">
                        Holding Value
                    </span>
                    <span className="text-xs">${formatCurrency(usd)}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground text-xs">Market Cap</span>
                    <span className="text-xs">
                        {formatCompact(price.usd_market_cap)}
                    </span>
                </div>
            </div>
        </div>
    );

    if (isDesktop) return triggerContent;

    return (
        <Drawer
            triggerClassName="w-full h-[64px] rounded-xl mb-2"
            triggerContent={triggerContent}
            headerTitle="Token Details"
            headerDescription={`Details and insights for ${price.symbol}`}
            disableFooter
        >
            <div className="space-y-4 p-2">
                <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5">
                    <div className="text-sm text-zinc-400">Holding Value</div>

                    <div className="mt-2 text-3xl font-bold text-white">
                        ${formatCurrency(usd)}
                    </div>

                    <TokenPriceChange
                        value={price.usd_24h_change}
                        className="mt-3 px-3 py-1 text-sm"
                    />
                </div>

                <div className="space-y-3 rounded-3xl border border-white/10 bg-zinc-900 p-5">
                    <TokenRow label="Holdings">
                        {formatCurrency(tokenBalance)} {price.symbol}
                    </TokenRow>
                    <TokenRow label="Price">${formatCurrency(price.usd)}</TokenRow>
                    <TokenRow label="Market Cap">
                        {formatCompact(price.usd_market_cap)}
                    </TokenRow>
                </div>
            </div>
        </Drawer>
    );
}
