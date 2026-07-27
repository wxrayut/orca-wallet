import {
    Contract,
    Mnemonic,
    Wallet,
    formatEther,
    formatUnits,
    parseEther,
    parseUnits,
} from "ethers";
import type { HDNodeWallet } from "ethers";

import {
    AssetTransfer,
    AssetType,
    type BalanceResponse,
    type HistoryResponse,
    type TokenBalance,
    TokenStandard,
    type TokenTransfer,
    TransactionStatus,
    TransactionType,
} from "@orca-wallet/shared";

import {
    ERC20_ABI,
    type OrcaProvider,
    OrcaReceipt,
    alchemyProvider,
    getTokens,
} from "../blockchain";
import type { BalanceOptions, GasEstimate, WalletOptions } from "../types";
import { Logger } from "../utils";

import { OrcaCrypto } from "./crypto";

/* The standard length for a mnemonic phrase is
   typically 12, 15, 18, 21, or 24 words. */
const PHRASE_LENGTH = 12;

export class OrcaWallet {
    private provider: OrcaProvider;

    private wallet: HDNodeWallet | null = null;
    private signerCache: HDNodeWallet | null = null;

    constructor(options: WalletOptions) {
        this.provider = options.provider;

        const { mnemonic } = options;

        if (mnemonic) {
            // Assume unencrypted mnemonic if it matches standard phrase length.
            if (mnemonic.split(" ").length === PHRASE_LENGTH) {
                this.wallet = Wallet.fromPhrase(mnemonic);
                this.signerCache = this.wallet.connect(this.provider);
            }
            // Assume encrypted mnemonic if it contains colon separator.
            else if (mnemonic.includes(":")) {
                this.importEncryptedMnemonic(mnemonic);
            } else {
                throw new Error(
                    `${mnemonic} is not a valid mnemonic phrase or encrypted mnemonic.`,
                );
            }
        }
    }

    private importEncryptedMnemonic(encryptedMnemonic: string): void {
        if (!encryptedMnemonic) {
            throw new Error(
                `${encryptedMnemonic} is not a valid encrypted mnemonic.`,
            );
        }

        const crypto = new OrcaCrypto();
        const decryptedMnemonic = crypto.decrypt(encryptedMnemonic);

        if (!Mnemonic.isValidMnemonic(decryptedMnemonic)) {
            throw new Error(`${decryptedMnemonic} is not a valid mnemonic.`);
        }

        this.wallet = Wallet.fromPhrase(decryptedMnemonic);
        this.signerCache = this.wallet.connect(this.provider);
    }

    private async buildGasConfig(
        gasLimit: bigint,
        safetyMultiplier: number = 1.15, // +15% buffer
    ): Promise<GasEstimate> {
        const feeData = await this.provider.getFeeData();

        if (!feeData.gasPrice || !feeData.maxFeePerGas) {
            throw new Error("Unable to retrieve gas price data from provider.");
        }

        const adjustedGasLimit = BigInt(
            Math.floor(Number(gasLimit) * safetyMultiplier),
        );

        if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
            const estimatedFee = adjustedGasLimit * feeData.maxFeePerGas;

            return {
                gasLimit: adjustedGasLimit,
                maxFeePerGas: feeData.maxFeePerGas,
                maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                estimatedFee,
            };
        }

        if (feeData.gasPrice) {
            const estimatedFee = adjustedGasLimit * feeData.gasPrice;

            return {
                gasLimit: adjustedGasLimit,
                gasPrice: feeData.gasPrice,
                estimatedFee,
            };
        }

        throw new Error("Unable to build gas configuration.");
    }

    public static create(): string {
        const crypto = new OrcaCrypto();
        const wallet = Wallet.createRandom();

        if (!wallet.mnemonic?.phrase) {
            throw new Error("Failed to create wallet with mnemonic phrase.");
        }

        return crypto.encrypt(wallet.mnemonic.phrase);
    }

    public static import(mnemonic: string): string {
        if (!Mnemonic.isValidMnemonic(mnemonic)) {
            throw new Error(`${mnemonic} is not a valid mnemonic phrase.`);
        }

        const crypto = new OrcaCrypto();
        const wallet = Wallet.fromPhrase(mnemonic);

        if (!wallet.mnemonic?.phrase) {
            throw new Error("Failed to import wallet with mnemonic phrase.");
        }

        return crypto.encrypt(wallet.mnemonic.phrase);
    }

    public get privateKey(): string {
        return this.wallet?.privateKey!;
    }

    public get mnemonic(): Mnemonic {
        return this.wallet?.mnemonic!;
    }

    public get address(): string {
        return this.wallet?.address!;
    }

    public get phrase(): string {
        return this.mnemonic?.phrase!;
    }

    public signer(): HDNodeWallet | null {
        return this.signerCache;
    }

    public async balance<T = BalanceResponse | TokenBalance[]>(
        options?: BalanceOptions,
    ): Promise<T> {
        if (!this.signerCache) {
            throw new Error(
                "Wallet signer is not initialized. Cannot fetch balance.",
            );
        }

        if (options?.nativeCurrency) {
            const raw = await this.provider.getBalance(this.signerCache.address);
            const balance = formatEther(raw);

            return {
                kind: AssetType.NATIVE,
                symbol: this.provider.blockchain,
                balance: balance,
            } as T;
        }

        const tokens = getTokens(this.provider.blockchain, this.provider.network);

        return Promise.all(
            tokens.map(async (token): Promise<TokenBalance> => {
                if (!this.signerCache) {
                    throw new Error(
                        "Wallet signer is not initialized. Cannot fetch balance.",
                    );
                }

                const contract = new Contract(
                    token.address,
                    ERC20_ABI,
                    this.signerCache,
                );
                const code = await this.provider.getCode(token.address);

                if (code === "0x") {
                    Logger.warning(
                        `Token contract not found for ${token.symbol} at address ${token.address}`,
                    );

                    return {
                        kind: AssetType.NATIVE,
                        symbol: token.symbol,
                        balance: "0.0",
                    };
                }

                if (!contract.balanceOf) {
                    throw new Error(
                        `Contract for ${token.symbol} does not have balanceOf method.`,
                    );
                }

                const raw = await contract.balanceOf(this.address);
                const balance = formatUnits(raw, token.decimals);

                return {
                    kind: AssetType.TOKEN,
                    symbol: token.symbol,
                    balance: balance,
                };
            }),
        ) as T;
    }

    public async transferNative(to: string, amount: string): Promise<OrcaReceipt> {
        if (!this.signerCache) {
            throw new Error(
                "Wallet signer is not initialized. Cannot perform transfer.",
            );
        }

        const value = parseEther(amount);
        const rawGasLimit = await this.signerCache.estimateGas({
            to,
            value,
        });
        const gasConfig = await this.buildGasConfig(rawGasLimit);
        const balance = await this.provider.getBalance(this.address!);
        const totalCost = value + gasConfig.estimatedFee;

        if (balance < totalCost) {
            throw new Error(
                `Insufficient funds. Need ${formatEther(
                    totalCost,
                )} ETH to cover transfer amount and estimated gas fees.`,
            );
        }

        const tx = await this.signerCache.sendTransaction({
            to,
            value,
            ...gasConfig,
        });

        return new OrcaReceipt(this.provider, tx.hash);
    }

    public async transfer(
        to: string,
        amount: string,
        tokenAddress: string,
    ): Promise<OrcaReceipt> {
        if (!this.signerCache) {
            throw new Error(
                "Wallet signer is not initialized. Cannot perform transfer.",
            );
        }

        const code = await this.provider.getCode(tokenAddress);

        if (code === "0x") {
            throw new Error(`Token contract not found at address ${tokenAddress}`);
        }

        const contract = new Contract(tokenAddress, ERC20_ABI, this.signerCache);

        if (!contract.decimals) {
            throw new Error(
                `Contract for token at address ${tokenAddress} does not have decimals method.`,
            );
        }

        const decimals = await contract.decimals();
        const value = parseUnits(amount, decimals);

        if (!contract.balanceOf) {
            throw new Error(
                `Contract for token at address ${tokenAddress} does not have balanceOf method.`,
            );
        }

        const balance = await contract.balanceOf(this.address);

        if (balance < value) {
            throw new Error(
                `Insufficient token balance to cover transfer amount of ${amount}.`,
            );
        }

        if (!contract.transfer) {
            throw new Error(
                `Contract for token at address ${tokenAddress} does not have transfer method.`,
            );
        }

        if (!contract.transfer.estimateGas) {
            throw new Error(
                `Contract for token at address ${tokenAddress} does not support gas estimation.`,
            );
        }

        const rawGasLimit = await contract.transfer.estimateGas(to, value);
        const gasConfig = await this.buildGasConfig(rawGasLimit);
        const ethBalance = await this.provider.getBalance(this.address!);

        if (ethBalance < gasConfig.estimatedFee) {
            throw new Error(
                `Insufficient ETH balance to cover estimated gas fees of ${formatEther(
                    gasConfig.estimatedFee,
                )} ETH.`,
            );
        }

        const tx = await contract.transfer(to, value, { ...gasConfig });

        return new OrcaReceipt(this.provider, tx.hash);
    }

    public async history(): Promise<HistoryResponse[]> {
        if (!this.signerCache) {
            throw new Error(
                "Wallet signer is not initialized. Cannot fetch transaction history.",
            );
        }

        const params = {
            fromBlock: "0x0",
            category: ["external", "erc20", "erc721", "erc1155"],
            withMetadata: true,
            maxCount: "0x32", // 50 transactions per direction (sent and received) = 100 total transactions
        };

        const [send, received] = await Promise.all([
            alchemyProvider.send("alchemy_getAssetTransfers", [
                {
                    fromAddress: this.address,
                    ...params,
                },
            ]),
            alchemyProvider.send("alchemy_getAssetTransfers", [
                {
                    toAddress: this.address,
                    ...params,
                },
            ]),
        ]);

        const transfers = [
            ...send.transfers,
            ...received.transfers,
        ] as AssetTransfer[];
        const grouped = new Map<string, AssetTransfer[]>();

        for (const t of transfers) {
            if (!grouped.has(t.hash)) {
                grouped.set(t.hash, []);
            }
            grouped.get(t.hash)!.push(t);
        }

        const txHashes = [...grouped.keys()];
        const transactions = await Promise.all(
            txHashes.map(async (hash) => {
                const [tx, receipt] = await Promise.all([
                    alchemyProvider.send("eth_getTransactionByHash", [hash]),
                    alchemyProvider.send("eth_getTransactionReceipt", [hash]),
                ]);
                const transfers = grouped.get(hash)!;
                const firstTransfer = transfers[0]!;
                const gasUsed = receipt?.gasUsed ? BigInt(receipt.gasUsed) : null;
                const effectiveGasPrice = receipt?.effectiveGasPrice
                    ? BigInt(receipt.effectiveGasPrice)
                    : null;
                const feePaid =
                    gasUsed && effectiveGasPrice
                        ? (gasUsed * effectiveGasPrice).toString()
                        : null;
                return {
                    chainId: Number(BigInt(tx.chainId)),
                    txHash: tx.hash,
                    type:
                        this.address?.toLowerCase() === tx.from.toLowerCase()
                            ? TransactionType.SEND
                            : TransactionType.RECEIVE,
                    assetType:
                        firstTransfer.category === "external" ||
                        firstTransfer.category === "internal"
                            ? AssetType.NATIVE
                            : AssetType.TOKEN,
                    fromAddress: tx.from,
                    toAddress: tx.to || null,
                    valueRaw: tx.value,
                    valueFormatted: tx.value ? formatEther(tx.value) : null,
                    status:
                        receipt?.status === "0x1"
                            ? TransactionStatus.COMPLETED
                            : TransactionStatus.FAILED,
                    blockNumber: tx.blockNumber
                        ? Number(BigInt(tx.blockNumber))
                        : null,
                    timestamp: new Date(firstTransfer.metadata.blockTimestamp),
                    receipt: {
                        txHash: tx.hash,
                        gasUsed: gasUsed?.toString() ?? null,
                        effectiveGasPrice: effectiveGasPrice?.toString() ?? null,
                        feePaid: feePaid,
                        blockHash: tx.blockHash ?? null,
                        blockNumber: tx.blockNumber
                            ? Number(BigInt(tx.blockNumber))
                            : null,
                        nonce: tx.nonce ? Number(BigInt(tx.nonce)) : null,
                        errorReason:
                            receipt?.status === "0x0" ? "Transaction failed" : null,
                    },
                    transfers: transfers.map((t) => {
                        const isNative = !t.rawContract.address;
                        const token = getTokens(
                            this.provider.blockchain,
                            this.provider.network,
                        ).find(
                            (token) =>
                                token.address.toLowerCase() ===
                                t.rawContract.address?.toLowerCase(),
                        );
                        const symbol = isNative
                            ? "ETH"
                            : (token?.symbol ?? "UNKNOWN");
                        const standard = isNative
                            ? TokenStandard.NATIVE
                            : TokenStandard.ERC20;
                        return {
                            txHash: t.hash,
                            tokenAddress: t.rawContract.address ?? null,
                            symbol: symbol,
                            decimals: Number(BigInt(t.rawContract.decimal)),
                            standard: standard,
                            fromAddress: t.from,
                            toAddress: t.to || null,
                            amountRaw: t.rawContract.value,
                            amountFormatted: formatUnits(
                                t.rawContract.value,
                                Number(t.rawContract.decimal),
                            ),
                        } as TokenTransfer;
                    }),
                };
            }),
        );

        return transactions;
    }
}
