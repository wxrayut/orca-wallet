"use client";

import { createContext, useCallback, useEffect, useState } from "react";

import { endpoints } from "~/endpoint";

import {
    type CreateWalletForm,
    type DeleteWalletForm,
    type GetPrivateKeyForm,
    type HistoryResponse,
    type ImportWalletForm,
    type NativeBalance,
    OrcaFetcher,
    type PrivateKeyResponse,
    type ResponseBody,
    type SendCryptoForm,
    type TokenBalance,
    type UpdateWalletDefaultForm,
    type UpdateWalletLabelForm,
    type Wallet,
} from "@orca-wallet/shared";

type WalletContextType = {
    wallets: Wallet[];
    balance: NativeBalance | null;
    tokens: TokenBalance[];
    activities: HistoryResponse[];
    loading: boolean;
    sendLoading: boolean;
    createWallet: (data: CreateWalletForm) => Promise<ResponseBody>;
    importWallet: (data: ImportWalletForm) => Promise<ResponseBody>;
    sendCrypto: (data: SendCryptoForm) => Promise<ResponseBody>;
    updateLabel: (data: UpdateWalletLabelForm) => Promise<void>;
    updateDefault: (data: UpdateWalletDefaultForm) => Promise<void>;
    loadPrivateKey: (data: GetPrivateKeyForm) => Promise<string>;
    loadBalance: (walletId: string) => Promise<void>;
    loadTokens: (walletId: string) => Promise<void>;
    loadActivities: (walletId: string) => Promise<void>;
    deleteWallet(data: DeleteWalletForm): Promise<void>;
    loadWallets(): Promise<void>;
};

type WalletProviderProps = {
    children: React.ReactNode;
};

export const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: WalletProviderProps) {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [balance, setBalance] = useState<NativeBalance | null>(null);
    const [tokens, setTokens] = useState<TokenBalance[]>([]);
    const [activities, setActivities] = useState<HistoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

    const createWallet = useCallback(async (data: CreateWalletForm) => {
        try {
            const response = await OrcaFetcher.post(
                endpoints.wallet.create("v1"),
                data,
            );

            if (!response.success) {
                throw new Error(response.message);
            }

            await loadWallets();
            return response;
        } finally {
        }
    }, []);

    const importWallet = useCallback(async (data: ImportWalletForm) => {
        try {
            const response = await OrcaFetcher.post(
                endpoints.wallet.import("v1"),
                data,
            );

            if (!response.success) {
                throw new Error(response.message);
            }

            await loadWallets();
            return response;
        } finally {
        }
    }, []);

    const sendCrypto = useCallback(async (data: SendCryptoForm) => {
        setSendLoading(true);

        try {
            const response = await OrcaFetcher.post(
                endpoints.wallet.send("v1"),
                data,
            );

            if (!response.success) {
                throw new Error(response.message);
            }

            await loadBalance(data.walletId);
            await loadTokens(data.walletId);
            await loadActivities(data.walletId);
            return response;
        } finally {
            setSendLoading(false);
        }
    }, []);

    const updateLabel = useCallback(async (data: UpdateWalletLabelForm) => {
        try {
            const response = await OrcaFetcher.patch(
                endpoints.wallet.update.label("v1"),
                data,
            );

            if (!response.success) {
                throw new Error(response.message);
            }

            await loadWallets();
        } finally {
        }
    }, []);

    const updateDefault = useCallback(async (data: UpdateWalletDefaultForm) => {
        try {
            const response = await OrcaFetcher.patch(
                endpoints.wallet.update.default("v1"),
                data,
            );

            if (!response.success) {
                throw new Error(response.message);
            }

            await loadWallets();
        } finally {
        }
    }, []);

    const loadPrivateKey = useCallback(async (data: GetPrivateKeyForm) => {
        try {
            const response = await OrcaFetcher.post<PrivateKeyResponse>(
                endpoints.wallet.get.privateKey("v1"),
                data,
            );

            if (!response.success || !response.data) {
                throw new Error(response.message);
            }

            return response.data.privateKey;
        } finally {
        }
    }, []);

    const loadBalance = useCallback(async (walletId: string) => {
        try {
            const response = await OrcaFetcher.post<NativeBalance>(
                endpoints.wallet.get.balance("v1"),
                {
                    walletId,
                },
            );

            if (response.success && response.data) {
                setBalance(response.data);
            }
        } finally {
        }
    }, []);

    const loadTokens = useCallback(async (walletId: string) => {
        try {
            const response = await OrcaFetcher.post<TokenBalance[]>(
                endpoints.wallet.get.tokens("v1"),
                {
                    walletId,
                },
            );

            if (response.success && response.data) {
                setTokens(response.data);
            }
        } finally {
        }
    }, []);

    const loadActivities = useCallback(async (walletId: string) => {
        try {
            const response = await OrcaFetcher.post<HistoryResponse[]>(
                endpoints.wallet.get.activities("v1"),
                {
                    walletId,
                },
            );

            if (response.success && response.data) {
                setActivities(response.data);
            }
        } finally {
        }
    }, []);

    const deleteWallet = useCallback(async (data: DeleteWalletForm) => {
        try {
            const response = await OrcaFetcher.post(
                endpoints.wallet.delete("v1"),
                data,
            );

            if (!response.success) {
                throw new Error(response.message);
            }

            await loadWallets();
        } finally {
        }
    }, []);

    const loadWallets = useCallback(async () => {
        setLoading(true);

        try {
            const response = await OrcaFetcher.get<Wallet[]>(
                endpoints.wallet.wallets("v1"),
            );

            if (response.success && response.data) {
                setWallets(response.data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWallets();
    }, [loadWallets]);

    return (
        <WalletContext.Provider
            value={{
                wallets,
                balance,
                tokens,
                activities,
                loading,
                sendLoading,
                createWallet,
                importWallet,
                sendCrypto,
                updateLabel,
                updateDefault,
                loadPrivateKey,
                loadBalance,
                loadTokens,
                loadActivities,
                deleteWallet,
                loadWallets,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
