import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
    AssetType,
    type CurrencyType,
    type HistoryResponse,
    type NativeBalance,
    type PriceItem,
    SYMBOL_TO_NAME,
    TOKEN_ICONS,
    type TokenBalance,
    TransactionType,
} from "@orca-wallet/shared";

type DateInput = Date | string | number;

type PresetFormat = "short" | "medium" | "long" | "full" | "time" | "datetime";

type FormatDateOptions = {
    locale?: string;
    preset?: PresetFormat;
    format?: Intl.DateTimeFormatOptions;
    timeZone?: string;
    relative?: boolean; // auto use relative time
    fallback?: string;
};

const dateConfigs: Record<PresetFormat, Intl.DateTimeFormatOptions> = {
    short: {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
    },
    medium: {
        year: "numeric",
        month: "short",
        day: "numeric",
    },
    long: {
        year: "numeric",
        month: "long",
        day: "numeric",
    },
    full: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    },
    time: {
        hour: "numeric",
        minute: "2-digit",
    },
    datetime: {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    },
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAddress(
    address: string,
    start: number = 6,
    end: number = 4,
    separator = "...",
) {
    return `${address.slice(0, start)}${separator}${address.slice(-end)}`;
}

export function getWalletValue(
    prices: Record<string, PriceItem>,
    symbol: string,
    currency: CurrencyType,
    balance?: string,
) {
    const price = prices[symbol]?.[currency] ?? 0;
    const amount = Number(balance);

    if (isNaN(amount)) return "0.00";

    return (price * amount).toFixed(2);
}

export function getTokenMetada(token: NativeBalance | TokenBalance) {
    const isNative = token.kind === AssetType.NATIVE;
    const symbol = isNative ? "ETH" : token.symbol;
    const icon = TOKEN_ICONS[symbol] ?? TOKEN_ICONS["default"];
    const name = SYMBOL_TO_NAME[symbol] ?? symbol;

    return {
        icon,
        name,
        symbol,
    };
}

export function getActivityMetadata(activity: HistoryResponse) {
    const isSend = activity.type === TransactionType.SEND;
    const isSingleTransfer = activity.transfers.length === 1;
    const isMainnet = activity.chainId === 1;

    const symbol = isSingleTransfer ? activity.transfers[0]?.symbol : "Multiple";
    const icon = isSingleTransfer
        ? (TOKEN_ICONS[activity.transfers[0]?.symbol] ?? TOKEN_ICONS["default"])
        : (TOKEN_ICONS["multiple"] ?? TOKEN_ICONS["default"]);
    const title = isSend ? "Sent" : "Received";
    const sender = formatAddress(activity.fromAddress!);
    const receiver = formatAddress(activity.toAddress!);
    const network = isMainnet ? "Ethereum Mainnet" : "Sepolia Testnet";
    const fee = formatFee(activity.receipt?.feePaid ?? 0);
    const date = formatDate(activity.timestamp);
    const txLink = isMainnet
        ? `https://etherscan.io/tx/${activity.txHash}`
        : `https://sepolia.etherscan.io/tx/${activity.txHash}`;

    return {
        isSend,
        symbol,
        icon,
        title,
        sender,
        receiver,
        network,
        fee,
        date,
        txLink,
    };
}

export function formatFee(wei: string | number) {
    const eth = Number(wei) / 1e18;

    if (eth < 0.0001) {
        return "<0.0001 ETH";
    }

    return `${eth.toFixed(6)} ETH`;
}

export function formatDate(input: DateInput, options: FormatDateOptions = {}) {
    const {
        locale = navigator?.language || "en-US",
        preset = "datetime",
        format,
        timeZone,
        relative = false,
        fallback = "-",
    } = options;

    const date = new Date(input);

    if (!!isNaN(date.getTime())) {
        return fallback;
    }

    if (relative) {
        return formatRelativeTime(date, locale);
    }

    const formatter = format || dateConfigs[preset];

    return new Intl.DateTimeFormat(locale, {
        ...formatter,
        timeZone,
    }).format(date);
}

export function formatRelativeTime(input: DateInput, locale = "en") {
    const date = new Date(input);

    if (!!isNaN(date.getTime())) {
        return "-";
    }

    const now = Date.now();
    const diff = (date.getTime() - now) / 1000;

    const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
    });

    const divisions = [
        { amount: 60, unit: "second" },
        { amount: 60, unit: "minute" },
        { amount: 24, unit: "hour" },
        { amount: 7, unit: "day" },
        { amount: 4.34524, unit: "week" },
        { amount: 12, unit: "month" },
        { amount: Infinity, unit: "year" },
    ] as const;

    let duration = diff;

    for (const division of divisions) {
        if (Math.abs(duration) < division.amount) {
            return rtf.format(
                Math.round(duration),
                division.unit as Intl.RelativeTimeFormatUnit,
            );
        }
        duration /= division.amount;
    }

    return "";
}
