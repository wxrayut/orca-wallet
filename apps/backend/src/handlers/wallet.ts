import {
    AssetType,
    TokenStandard,
    TransactionStatus,
    TransactionType,
    type User,
} from "@prisma/client";
import { formatEther, parseEther, parseUnits } from "ethers";
import type { Response } from "express";

import { type NativeBalance, OrcaFetcher } from "@orca-wallet/shared";

import { OrcaReceipt, getTokenMetadata, orcaProvider } from "../blockchain";
import { OrcaWallet } from "../core";
import { TokenService, TransactionService, WalletService } from "../services";
import type { TransactionExecutionData } from "../types";
import { OrcaResponse, getWallet } from "../utils";

// Regex pattern to validate Ethereum addresses (0x followed by 40 hexadecimal characters)
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

async function createTransaction(data: TransactionExecutionData) {
    const { transfers, ...transaction } = data;

    const tx = await TransactionService.create({
        ...transaction,
    });

    await TokenService.createMany([
        ...data.transfers.map((transfer) => ({
            transactionId: tx.id,
            ...transfer,
        })),
    ]);
}

export async function handleWalletCreate(
    response: Response,
    user: User,
    label: string = "My Wallet",
) {
    const mnemonic = OrcaWallet.create();

    if (!mnemonic) {
        return OrcaResponse.ServerError(
            response,
            "An error occurred while creating wallet",
        );
    }

    const wallet = new OrcaWallet({
        provider: orcaProvider,
        mnemonic: mnemonic,
    });

    if (!wallet.privateKey || !wallet.address) {
        return OrcaResponse.ServerError(
            response,
            "An error occurred while creating wallet",
        );
    }

    const native = await wallet.balance<NativeBalance>({
        nativeCurrency: true,
    });

    await WalletService.create({
        userId: user.id,
        chainId: orcaProvider.chainId,
        blockchain: orcaProvider.blockchain,
        label: label,
        address: wallet.address.toLowerCase(),
        isDefault: false,
        balance: native.balance.toString(),
        encryptedMnemonic: OrcaWallet.import(wallet.phrase),
    });

    return OrcaResponse.Ok(response, {
        message: "Wallet created successfully.",
    }).send();
}

export async function handleWalletImport(
    response: Response,
    user: User,
    label: string = "My Wallet",
    phrase: string,
) {
    const wallet = new OrcaWallet({
        provider: orcaProvider,
        mnemonic: phrase,
    });

    if (!wallet.privateKey || !wallet.address) {
        return OrcaResponse.BadRequest(
            response,
            "Invalid mnemonic phrase provided for wallet import.",
        );
    }

    const existing = await WalletService.getByAddress(wallet.address.toLowerCase());

    if (existing) {
        return OrcaResponse.Conflict(
            response,
            "A wallet with the same address already exists.",
        );
    }

    const native = await wallet.balance<NativeBalance>({
        nativeCurrency: true,
    });
    const activities = await wallet.history();

    const newWallet = await WalletService.create({
        userId: user.id,
        chainId: orcaProvider.chainId,
        blockchain: orcaProvider.blockchain,
        label: label,
        address: wallet.address.toLowerCase(),
        isDefault: false,
        balance: native.balance.toString(),
        encryptedMnemonic: OrcaWallet.import(phrase),
    });

    await Promise.all(
        activities.map((activity) =>
            WalletService.createActivity(newWallet.id, activity),
        ),
    );

    return OrcaResponse.Ok(response, {
        message: "Wallet imported successfully.",
    }).send();
}

export async function handleWalletSend(
    response: Response,
    type: AssetType,
    walletId: string,
    symbol: string,
    amount: string,
    toAddress: string,
) {
    const wallet = await getWallet(walletId);

    if (!ETH_ADDRESS_REGEX.test(toAddress)) {
        return OrcaResponse.BadRequest(
            response,
            "Invalid recipient address format. Please provide a valid Ethereum address.",
        );
    }

    const isToken = type === AssetType.TOKEN;
    const token = isToken
        ? getTokenMetadata(orcaProvider.blockchain, orcaProvider.network, symbol)
        : null;

    if (isToken && !token) {
        return OrcaResponse.BadRequest(
            response,
            `Unsupported token symbol: ${symbol}. Unable to find token metadata.`,
        );
    }

    let tx: OrcaReceipt | null = null;

    switch (type) {
        case AssetType.NATIVE:
            tx = await wallet.transferNative(toAddress, amount);
            break;
        case AssetType.TOKEN:
            tx = await wallet.transfer(toAddress, amount, token!.address);
            break;
        default:
            return OrcaResponse.BadRequest(
                response,
                "Invalid asset type specified for transfer.",
            );
    }

    if (!tx) {
        return OrcaResponse.ServerError(
            response,
            "An error occurred while processing the transaction.",
        );
    }

    const decimals = token?.decimals ?? 18;
    const standard = token?.standard ?? TokenStandard.NATIVE;
    const parsed = isToken ? parseEther(amount) : parseUnits(amount, decimals);
    const formatted = formatEther(parsed);

    const base = {
        chainId: orcaProvider.chainId,
        txHash: tx.hash,
        assetType: type,
        fromAddress: wallet.address,
        toAddress,
        valueRaw: amount,
        valueFormatted: formatted,
        status: TransactionStatus.PENDING,
        blockNumber: null,
        timestamp: new Date(),
    };
    const transfer = {
        txHash: tx.hash,
        tokenAddress: token?.address ?? null,
        symbol,
        decimals,
        standard: standard,
        fromAddress: wallet.address,
        toAddress,
        amountRaw: amount,
        amountFormatted: formatted,
    };

    await createTransaction({
        ...base,
        walletId,
        type: TransactionType.SEND,
        transfers: [transfer],
    });

    const receiver = await WalletService.getByAddress(toAddress.toLowerCase());

    if (receiver) {
        await createTransaction({
            ...base,
            walletId: receiver.id,
            type: TransactionType.RECEIVE,
            transfers: [transfer],
        });
    }

    return OrcaResponse.Success(response, {
        message: `Sent ${amount} ${symbol} successfully. Transaction hash: ${tx.hash}`,
    });
}

export async function handleWalletGetBalance(response: Response, walletId: string) {
    const wallet = await getWallet(walletId);
    const native = await wallet.balance<NativeBalance>({
        nativeCurrency: true,
    });

    await WalletService.updateById(walletId, {
        balance: native.balance.toString(),
    });

    return OrcaResponse.Success(response, {
        message: "Balance fetched successfully.",
        data: native,
    });
}

export async function handleWalletGetPrivateKey(
    response: Response,
    walletId: string,
) {
    const wallet = await getWallet(walletId);

    if (!wallet.phrase) {
        return OrcaResponse.BadRequest(
            response,
            "No mnemonic phrase found for the specified wallet.",
        );
    }

    return OrcaResponse.Success(response, {
        message: "Private key fetched successfully.",
        data: {
            privateKey: wallet.phrase,
        },
    });
}

export async function handleWalletGetTokens(response: Response, walletId: string) {
    const wallet = await getWallet(walletId);
    const tokens = await wallet.balance();

    return OrcaResponse.Success(response, {
        message: "Tokens fetched successfully.",
        data: tokens,
    });
}

export async function handleWalletGetActivity(response: Response, walletId: string) {
    const activity = await TransactionService.getByWalletId(walletId, {
        receipt: true,
        transfers: true,
    });

    return OrcaResponse.Success(response, {
        message: "Activity fetched successfully.",
        data: activity,
    });
}

export async function handleGetTokenPrices(response: Response, symbols: string) {
    // NOTE: This endpoint is intended to proxy price data from CoinGecko.
    //
    // CoinGecko uses "ids" (e.g. "tether", "usd-coin") instead of
    // token symbols (e.g. "USDT", "USDC"). Make sure to map symbols <-> CoinGecko IDs
    // on both request and response layers.
    //
    // Example:
    //   USDT -> tether
    //   USDC -> usd-coin
    //   SHIB -> shiba-inu
    //
    // Currently using a mocked response to avoid hitting CoinGecko rate limits during
    // development/testing. Replace this with a real API call in production:
    //
    // `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd,thb&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=full`;
    //
    // IMPORTANT:
    //   Always normalize response keys back to application symbols (e.g. "USDT", "USDC")
    //   before returning to the client.

    // Example of how to fetch real data from CoinGecko:
    //
    // const raw = await OrcaFetcher.get(
    //     `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd,thb&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=full`,
    // );

    // Example response structure from CoinGecko:
    // {
    //   ethereum: {
    //     usd: 2120.946747453488,
    //     usd_market_cap: 255973144657.56555,
    //     usd_24h_vol: 12028318258.44936,
    //     usd_24h_change: 4.2415352556045045,
    //     thb: 69132.61343135325,
    //     thb_market_cap: 8343487397628.504,
    //     thb_24h_vol: 392065042363.30597,
    //     thb_24h_change: 3.9523390656762065,
    //     last_updated_at: 1775457103
    //   }
    // }

    const raw = {
        aave: {
            usd: 96.1028134284756,
            usd_market_cap: 1459949489.39583,
            usd_24h_vol: 159589020.460589,
            usd_24h_change: -1.04781140227346,
            thb: 3151.98584099595,
            thb_market_cap: 47883510950.1737,
            thb_24h_vol: 5234210268.40764,
            thb_24h_change: -1.07132041861946,
            last_updated_at: 1774778273,
        },
        ethereum: {
            usd: 2120.946747453488,
            usd_market_cap: 255973144657.56555,
            usd_24h_vol: 12028318258.44936,
            usd_24h_change: 4.2415352556045045,
            thb: 69132.61343135325,
            thb_market_cap: 8343487397628.504,
            thb_24h_vol: 392065042363.30597,
            thb_24h_change: 3.9523390656762065,
            last_updated_at: 1775457103,
        },
        "shiba-inu": {
            usd: 0.000005789637917382,
            usd_market_cap: 3409902551.30332,
            usd_24h_vol: 93368300.663744,
            usd_24h_change: -0.569361962542503,
            thb: 0.000189888891792583,
            thb_market_cap: 111838188471.799,
            thb_24h_vol: 3062299127.26752,
            thb_24h_change: -0.592984648690623,
            last_updated_at: 1774778273,
        },
        tether: {
            usd: 0.99925364032047,
            usd_market_cap: 184079062441.703,
            usd_24h_vol: 36438732010.1158,
            usd_24h_change: -0.0103029517209726,
            thb: 32.7735808504492,
            thb_market_cap: 6037436134706.73,
            thb_24h_vol: 1195119718791.7,
            thb_24h_change: -0.0340584588567992,
            last_updated_at: 1774778273,
        },
        uniswap: {
            usd: 3.37835723525727,
            usd_market_cap: 2140956835.50176,
            usd_24h_vol: 116344331.141841,
            usd_24h_change: 0.0370788009558188,
            thb: 110.803563303402,
            thb_market_cap: 70219230748.197,
            thb_24h_vol: 3815868353.44998,
            thb_24h_change: 0.0133120368845545,
            last_updated_at: 1774778272,
        },
        "usd-coin": {
            usd: 0.99980304447792,
            usd_market_cap: 77719265840.6133,
            usd_24h_vol: 3104742256.08625,
            usd_24h_change: 0.00675326858964019,
            thb: 32.7916002409695,
            thb_market_cap: 2549041144196.38,
            thb_24h_vol: 101829522799.652,
            thb_24h_change: -0.017006290755318,
            last_updated_at: 1774778273,
        },
    };

    const normalized = Object.entries(raw).map(([symbol, data]) => ({
        symbol,
        ...data,
    }));

    return OrcaResponse.Success(response, {
        message: "Token prices fetched successfully.",
        data: {
            prices: normalized,
            meta: {
                currency: ["usd", "thb"],
                updatedAt: Date.now(),
            },
        },
    });
}

export async function handleWalletUpdateLabel(
    response: Response,
    walletId: string,
    label: string,
) {
    await WalletService.updateLabelById(walletId, label);

    return OrcaResponse.Success(response, {
        message: "Wallet label updated successfully.",
    });
}

export async function handleWalletSetDefault(
    response: Response,
    walletId: string,
    isDefault: boolean,
) {
    await WalletService.updateDefaultById(walletId, isDefault);

    return OrcaResponse.Success(response, {
        message: "Wallet set as default successfully.",
    });
}

export async function handleWalletExport(response: Response) {}

export async function handleWalletDelete(response: Response, walletId: string) {
    await WalletService.deleteById(walletId);

    return OrcaResponse.Success(response, {
        message: "Wallet deleted successfully.",
    });
}
