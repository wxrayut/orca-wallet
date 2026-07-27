"use client";

import * as React from "react";

import { WalletContext } from "~/contexts";

import { endpoints } from "~/endpoint";

import {
    COINGECKO_ID_TO_SYMBOL,
    OrcaFetcher,
    type PriceItem,
    type PriceResponse,
    SYMBOL_TO_COINGECKO_ID,
    type Wallet,
    type WalletResponse,
} from "@orca-wallet/shared";

export function useWallet() {
    const ctx = React.useContext(WalletContext);

    if (!ctx) {
        throw new Error("useWallet must be used within an WalletProvider");
    }

    return ctx;
}

export function useDefaultWallet(wallets: WalletResponse[] | null) {
    return React.useMemo(() => {
        if (!wallets || wallets.length === 0) {
            return null;
        }
        return wallets.find((w) => w.isDefault) || null;
    }, [wallets]);
}

export function useActiveWallet(
    wallets: WalletResponse[] | null,
    selectedWallet: Wallet | null,
) {
    const defaultWallet = useDefaultWallet(wallets);

    return React.useMemo(() => {
        if (!wallets || wallets.length === 0) {
            return null;
        }
        if (selectedWallet) {
            return wallets.find((w) => w.id === selectedWallet.id) || null;
        }
        return defaultWallet || wallets[0] || null;
    }, [wallets, selectedWallet, defaultWallet]);
}

export function useSyncWallet(wallet: Wallet | null) {
    const { loadBalance, loadTokens, loadActivities } = useWallet();

    React.useEffect(() => {
        if (wallet) {
            loadBalance(wallet.id);
            loadTokens(wallet.id);
            loadActivities(wallet.id);
        }
    }, [wallet, loadBalance, loadTokens, loadActivities]);
}

export function useCryptoPrice(symbols: string[]) {
    const [prices, setPrices] = React.useState<Record<string, PriceItem>>({});
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (symbols.length === 0) {
            return;
        }

        let mounted = true;

        async function loadTokenPrices() {
            setLoading(true);

            const query = symbols
                .map((s) => {
                    return SYMBOL_TO_COINGECKO_ID[s] ?? s.toLowerCase();
                })
                .join(",");

            try {
                const response = await OrcaFetcher.post<PriceResponse>(
                    endpoints.wallet.get.tokenPrices("v1"),
                    {
                        symbols: query,
                    },
                );

                if (!response.success || !response.data) {
                    throw new Error(response.message);
                }

                const mapped: Record<string, PriceItem> = {};
                const entries = Object.entries(response.data.prices);

                for (const [_, price] of entries) {
                    const symbol = COINGECKO_ID_TO_SYMBOL[price.symbol];
                    mapped[symbol] = {
                        ...price,
                        symbol,
                    };
                }

                if (mounted) {
                    setPrices(mapped);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadTokenPrices();

        return () => {
            mounted = false;
        };
    }, [symbols]);

    return {
        prices,
        loading,
    };
}
