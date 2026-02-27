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

export type TokenTransfer = {
    id: string;
    transactionId: string;
    txHash: string;
    tokenAddress: string;
    symbol: string;
    decimals: number;
    standard: TokenStandard;
    amountRaw: string;
    formattedAmount: string;
    fromAddress: string;
    toAddress: string;
    createdAt: Date;
};

export type TransactionReceipt = {
    id: string;
    transactionId: string;
    txHash: string;
    gasUsed?: string | null;
    effectiveGasPrice?: string | null;
    feePaid?: string | null;
    blockHash?: string | null;
    blockNumber?: number | null;
    nonce?: number | null;
    errorReason?: string | null;
    createdAt: Date;
};

export type Transaction = {
    id: string;
    walletId: string;
    chainId: number;
    txHash?: string | null;
    type: TransactionType;
    assetType: AssetType;
    fromAddress: string;
    toAddress?: string | null;
    valueRaw?: string | null;
    valueFormatted?: string | null;
    status: TransactionStatus;
    blockNumber?: number | null;
    timestamp: Date;
    createdAt: Date;
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

export type IncludeRelations<M, R> = M & R;

export type TransactionResponse = IncludeRelations<
    Transaction,
    {
        receipt?: TransactionReceipt | null;
        transfers?: TokenTransfer[];
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
