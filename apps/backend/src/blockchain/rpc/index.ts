import type { Blockchain, Network, RpcProvider, RpcUrlMap } from "../../types";

import { alchemy } from "./alchemy";

const rpcUrls: RpcUrlMap = {
    alchemy,
};

export function getRpcUrl(
    providerName: RpcProvider,
    blockchain: Blockchain,
    network: Network,
): string {
    return rpcUrls[providerName]?.[blockchain]?.[network] as string;
}
