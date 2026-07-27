import { AlchemyProvider } from "ethers";

import { rpcConfig } from "../../config";
import type { Blockchain, Network, RpcProvider } from "../../types";

import { OrcaProvider } from "./provider";

export const alchemyProvider = new AlchemyProvider(
    rpcConfig.network,
    rpcConfig.rpcKey,
);

export const orcaProvider = new OrcaProvider({
    providerName: rpcConfig.providerName as RpcProvider,
    blockchain: rpcConfig.blockchain as Blockchain,
    network: rpcConfig.network as Network,
    rpcKey: rpcConfig.rpcKey as string,
});

export { OrcaProvider };
