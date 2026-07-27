import type {
    Role,
    TokenStandard,
    TokenTransfer,
    Transaction,
    TransactionReceipt,
    User,
    Wallet,
} from "@prisma/client";
import type { TransactionReceipt as EtherTransactionReceipt } from "ethers";
import type { StringValue } from "ms";

import type { HistoryResponse } from "@orca-wallet/shared";

import type { OrcaProvider } from "../blockchain";
import type { OrcaWallet } from "../core";

export type RpcProvider = "alchemy";

export type Blockchain = "ethereum";

export type Network = "mainnet" | "sepolia";

export interface ProviderConfig {
    providerName: RpcProvider;
    chainId?: number;
    blockchain: Blockchain;
    network: Network;
    rpcKey: string;
}

export type RpcUrlMap = Partial<
    Record<RpcProvider, Record<Blockchain, Partial<Record<Network, string>>>>
>;

export type ChainMap = Record<Blockchain, Partial<Record<Network, number>>>;

export interface Token {
    symbol: string;
    label: string;
    address: string;
    decimals: number;
    standard: TokenStandard;
}

export type TokenMap = Record<Blockchain, Partial<Record<Network, Token[]>>>;

export interface OrcabCryptOptions {
    saltRounds?: number;
}

export type CryptoAlgorithm = "aes-256-gcm" | "aes-192-gcm" | "aes-128-gcm";

export interface CryptoEncryptOptions {
    iv?: string;
    algorithm?: CryptoAlgorithm;
}

export interface CryptoDecryptOptions {
    algorithm?: CryptoAlgorithm;
}

export interface JWTSignOptions {
    expiresIn?: number | StringValue;
}

export interface JWTVerifyOptions {
    ignoreExpiration?: boolean;
}

export interface JWTPayload {
    sub: string;
    email: string;
    role: Role;
    iat: number;
    exp: number;
}

export interface WalletOptions {
    provider: OrcaProvider;
    mnemonic?: string;
}

export interface BalanceOptions {
    nativeCurrency?: boolean;
}

export interface Eip1559Gas {
    gasLimit: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    estimatedFee: bigint;
}

export interface LegacyGas {
    gasLimit: bigint;
    gasPrice: bigint;
    estimatedFee: bigint;
}

export type GasEstimate = Eip1559Gas | LegacyGas;

export interface Receipt extends EtherTransactionReceipt {
    feeFormatted: string | undefined;
}

export type ReceiptOnConfirmedCallback = (receipt: Receipt) => void;

export type ReceiptOnFailedCallback = (error: unknown) => void;

export type UnsubscribeListener = () => void;

export type ListenerFactory = () => UnsubscribeListener;

export type ListenerState = {
    enabled: boolean;
    unsubscribe?: UnsubscribeListener;
};

export type UserData = Omit<User, "id" | "createdAt" | "updatedAt">;

export interface UserInclude {
    wallets?: boolean;
}

export type WalletData = Omit<Wallet, "id" | "createdAt" | "updatedAt">;

export interface WalletInclude {
    transactions?: boolean;
}

export type TransactionData = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

export interface TransactionInclude {
    receipt?: boolean;
    transfers?: boolean;
}

export type TransactionReceiptData = Omit<
    TransactionReceipt,
    "id" | "createdAt" | "updatedAt"
>;

export interface TransactionReceiptInclude {}

export type TokenTransferData = Omit<
    TokenTransfer,
    "id" | "createdAt" | "updatedAt"
>;

export interface TokenTransferInclude {}

export type TransactionExecutionData = Omit<
    Transaction,
    "id" | "createdAt" | "updatedAt"
> & {
    transfers: Omit<TokenTransfer, "id" | "transactionId" | "createdAt">[];
};

export interface OtpAssignOptions {
    length?: number;
    expiryTime?: number;
}

export interface OtpAssignSession {
    expiryTime?: number;
}

export interface OtpRedisKeys {
    otp: string;
    cooldown: string;
    attempt: string;
    lock: string;
}

export interface CookieOptions {
    domain?: string;
    encode?: (val: string) => string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    priority?: "low" | "medium" | "high";
    sameSite?: boolean | "lax" | "strict" | "none";
    secure?: boolean;
}

export type WalletContext = {
    walletId: string;
    wallet: OrcaWallet;
    history: Map<string, HistoryResponse>;
};

export type LoggerLevel =
    | "ENTER"
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR"
    | "DEBUG"
    | "ALERT"
    | "TRACE"
    | "EXIT";

export type LoggerStyle = Record<
    LoggerLevel,
    {
        emoji: string;
        message?: string;
    }
>;
