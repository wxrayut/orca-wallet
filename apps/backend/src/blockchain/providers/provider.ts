import { JsonRpcProvider } from "ethers";

import type {
    Blockchain,
    Network,
    ProviderConfig,
    RpcProvider,
} from "../../types";
import { getChainId } from "../chains";
import { getRpcUrl } from "../rpc";

export class OrcaProvider extends JsonRpcProvider {
    readonly url: string | undefined;
    readonly providerName: RpcProvider;
    readonly chainId: number;
    readonly blockchain: Blockchain;
    readonly network: Network;
    readonly rpcKey: string;

    constructor(config: ProviderConfig) {
        const { providerName, blockchain, network, rpcKey } = config;
        const baseUrl = getRpcUrl(providerName, blockchain, network);
        const chainId = config.chainId ?? getChainId(blockchain, network);

        if (!baseUrl) {
            throw new Error(
                `RPC URL not found for provider "${providerName}" on blockchain "${blockchain}" and network "${network}".`,
            );
        }

        const rpcUrl = baseUrl
            ? `${baseUrl}`.replace("{API_KEY}", rpcKey)
            : undefined;

        super(
            rpcUrl,
            {
                name: network,
                chainId: chainId,
            },
            {
                batchMaxCount: 1,
            },
        );

        this.url = rpcUrl;
        this.providerName = providerName;
        this.chainId = chainId;
        this.blockchain = blockchain;
        this.network = network;
        this.rpcKey = rpcKey;
    }
}
