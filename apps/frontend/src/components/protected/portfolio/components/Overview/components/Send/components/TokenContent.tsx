import Image from "next/image";

/* import { TokenIcon } from "~/components/TokenIcon"; */
import { ScrollArea } from "~/components/ui/scroll-area";

import { cn } from "~/lib/utils";
import { getTokenMetada } from "~/lib/utils";

import type { TokenBalance } from "@orca-wallet/shared";

type TokenContentProps = {
    tokens: TokenBalance[];
    selectedToken: TokenBalance;
    setSelectedToken: (token: TokenBalance) => void;
};

export default function TokenContent({
    tokens,
    selectedToken,
    setSelectedToken,
}: TokenContentProps) {
    return (
        <ScrollArea className="flex h-70 flex-col gap-2 md:h-75">
            {tokens.map((token) => {
                const { icon, name, symbol } = getTokenMetada(token);
                const isSelected = token === selectedToken;

                return (
                    <div
                        key={token.symbol}
                        className={cn(
                            "group mt-2 flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all",
                            "hover:bg-muted/50",
                            isSelected
                                ? "bg-primary/5 border-blue-500"
                                : "border-border",
                        )}
                        onClick={() => setSelectedToken(token)}
                    >
                        <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex gap-2">
                                <Image
                                    src={icon}
                                    alt={symbol}
                                    width={35}
                                    height={35}
                                    className="rounded-full object-cover"
                                />

                                <div className="flex flex-col text-left">
                                    <p className="text-xs md:text-sm">{name}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {symbol}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm font-medium">{token.balance}</p>
                        </div>
                    </div>
                );
            })}
        </ScrollArea>
    );
}
