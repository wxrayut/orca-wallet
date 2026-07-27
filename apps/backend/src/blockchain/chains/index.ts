import type { Blockchain, ChainMap, Network } from "../../types";

import { ethereum } from "./ethereum";

const chainIds: ChainMap = {
    ethereum,
};

export function getChainId(blockchain: Blockchain, network: Network): number {
    return chainIds[blockchain][network] as number;
}
