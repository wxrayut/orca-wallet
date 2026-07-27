import type { Blockchain, Network, Token, TokenMap } from "../../types";

import { ethereum } from "./ethereum";

const tokens: TokenMap = {
    ethereum,
};

export function getTokens(blockchain: Blockchain, network: Network): Token[] {
    return tokens[blockchain][network] ?? [];
}

export function getTokenMetadata(
    blockchain: Blockchain,
    network: Network,
    symbol: string,
): Token | null {
    const token = getTokens(blockchain, network).find((t) => {
        return t.symbol.toLowerCase() === symbol.toLowerCase();
    });
    return token || null;
}
