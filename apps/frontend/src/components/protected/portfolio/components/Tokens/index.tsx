"use client";

import { useMemo } from "react";

import { SubsectionTitle } from "~/components/primitives";
import { Separator } from "~/components/ui/separator";
import { TabsContent } from "~/components/ui/tabs";

import { useCryptoPrice, useWallet } from "~/hooks";

import TokenList from "./components/TokenList";

type TokensProps = {};

export default function Tokens({}: TokensProps) {
    const { tokens } = useWallet();

    const symbols = useMemo(() => tokens.map((token) => token.symbol), [tokens]);

    const { prices } = useCryptoPrice(symbols);

    return (
        <TabsContent value="tokens">
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <SubsectionTitle
                        title="Tokens"
                        description="Track your crypto portfolio in real-time"
                    />
                </div>

                <Separator />

                <div className="mt-4">
                    <TokenList tokens={tokens} prices={prices} />
                </div>
            </div>
        </TabsContent>
    );
}
