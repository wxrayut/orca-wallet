import { ScrollArea } from "~/components/ui/scroll-area";

import { PriceItem, TokenBalance } from "@orca-wallet/shared";

import TokenItem from "./components/TokenItem";

type TokenListProps = {
    tokens: TokenBalance[];
    prices: Record<string, PriceItem>;
};

export default function TokenList({ tokens, prices }: TokenListProps) {
    return (
        <ScrollArea className="flex gap-2 md:h-120">
            {tokens.map((token) => (
                <TokenItem
                    key={token.symbol}
                    token={token}
                    price={prices[token.symbol]}
                />
            ))}
        </ScrollArea>
    );
}
