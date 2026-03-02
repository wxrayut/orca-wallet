import type { StringValue } from "ms";

import { NETWORKS } from "./config";

export type Env = string | StringValue;

export type FetchOptions<B = unknown> = Omit<RequestInit, "body"> & {
    body?: B;
};

export type ResponseBody<T extends object | object[] = {}> = {
    status: number;
    message: string;
    success: boolean;
    data?: T | undefined;
};

export type NetworkType = (typeof NETWORKS)[number];

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

export enum AssetType {
    NATIVE = "NATIVE",
    TOKEN = "TOKEN",
}

export enum TokenStandard {
    ERC20 = "ERC20",
    UNKNOWN = "UNKNOWN",
}

export enum TransactionType {
    SEND = "SEND",
    RECEIVE = "RECEIVE",
    CONTRACT = "CONTRACT",
}

export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export type User = {
    id: string;
    email: string;
    username: string;
    password: string;
    avatarUrl?: string | null;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    lastLogin?: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Wallet = {
    id: string;
    userId: string;
    chainId: number;
    blockchain: string;
    label?: string | null;
    address: string;
    isDefault: boolean;
    balance: string;
    encryptedMnemonic: string;
    createdAt: Date;
    updatedAt: Date;
};

export type Transaction = {
    id: string;
    walletId: string;
    chainId: number;
    txHash: string | null;
    type: TransactionType;
    assetType: AssetType;
    fromAddress: string;
    toAddress: string | null;
    valueRaw: string | null;
    valueFormatted?: string | null;
    status: TransactionStatus;
    blockNumber: number | null;
    timestamp: Date;
    createdAt: Date;
};

export type TransactionReceipt = {
    id: string;
    transactionId: string;
    txHash: string;
    gasUsed: string | null;
    effectiveGasPrice: string | null;
    feePaid: string | null;
    blockHash: string | null;
    blockNumber: number | null;
    nonce: number | null;
    errorReason: string | null;
    createdAt: Date;
};

export type TokenTransfer = {
    id: string;
    transactionId: string;
    txHash: string;
    tokenAddress: string;
    symbol: string;
    decimals: number;
    standard: TokenStandard;
    amountRaw: string;
    amountFormatted: string;
    fromAddress: string;
    toAddress: string;
    createdAt: Date;
};

export type IncludeRelations<M, R> = M & R;

export type TransactionResponse = IncludeRelations<
    Transaction,
    {
        receipt?: TransactionReceipt | null;
        transfers?: TokenTransfer[];
    }
>;

export type HistoryResponse = IncludeRelations<
    Omit<Transaction, "id" | "walletId" | "createdAt">,
    {
        receipt: Omit<TransactionReceipt, "id" | "transactionId" | "createdAt">;
        transfers: Omit<TokenTransfer, "id" | "transactionId" | "createdAt">[];
    }
>;

export type WalletResponse = IncludeRelations<
    Wallet,
    {
        transactions?: TransactionResponse[];
    }
>;

export type UserResponse = IncludeRelations<
    User,
    {
        wallets?: WalletResponse[];
    }
>;

export interface WalletBalance {
    symbol: string;
    balance: string;
}

export interface NativeBalance extends WalletBalance {
    kind: string;
}

export interface TokenBalance extends WalletBalance {
    kind: string;
}

export type BalanceResponse = NativeBalance | TokenBalance[];

export type AssetTransferCategory =
    | "external"
    | "internal"
    | "erc20"
    | "erc721"
    | "erc1155"
    | string;

export interface AssetTransfer {
    blockNumber: `0x${string}`;
    uniqueId: string;
    hash: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}` | null;
    value: number;
    erc721TokenId: string | null;
    erc1155Metadata: unknown[] | null;
    tokenId: string | null;
    asset: string;
    category: AssetTransferCategory;
    rawContract: {
        value: `0x${string}`;
        address: `0x${string}` | null;
        decimal: `0x${string}`;
    };
    metadata: {
        blockTimestamp: string;
    };
}

export enum AuthContextState {
    GUEST = "GUEST",
    AUTHORIZED = "AUTHORIZED",
    UNAUTHORIZED = "UNAUTHORIZED",

    LOGIN = "LOGIN",
    REGISTER = "REGISTER",

    VERIFY_OTP = "VERIFY_OTP",
    RESEND_OTP = "RESEND_OTP",

    LOGOUT = "LOGOUT",
}

export enum Purpose {
    NONE = "NONE",

    LOGIN = "LOGIN",
    REGISTER = "REGISTER",

    TRANSFER = "TRANSFER",
    SWAP = "SWAP",

    RESET_PASSWORD = "RESET_PASSWORD",
    CHANGE_PASSWORD = "CHANGE_PASSWORD",
}

export interface StateResponse {
    state: AuthContextState;
    purpose: Purpose;
}

export interface LoginForm {
    emailOrusername: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SendOTPForm {
    purpose: Purpose;
}

export interface VerifyOTPForm {
    code: string;
}

export interface SessionCheckForm {
    token: string;
}

export interface ResetPasswordForm {
    email: string;
}

export type AuthForm =
    | LoginForm
    | RegisterForm
    | VerifyOTPForm
    | ResetPasswordForm;

export interface CreateWalletForm {
    label?: string;
    network: NetworkType;
}

export interface ImportWalletForm {
    label?: string;
    phrase: string;
    network: NetworkType;
}

export type SessionUser = {
    state: AuthContextState;
    email: string;
    role: Role;
    rememberMe?: boolean;
    purpose: Purpose;
};

export interface HealthResponse {
    status: string;
    uptime: number;
    timestamp: string;
}

export interface StatsResponse {
    users_count: number;
    wallets_count: number;
    transactions_count: number;
}

export interface GithubStatsResponse {
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
}
