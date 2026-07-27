import Image from "next/image";

import { IconDownload, IconSend } from "@tabler/icons-react";

import { getActivityMetadata, getTokenMetada } from "~/lib/utils";

import type {
    HistoryResponse,
    NativeBalance,
    TokenBalance,
} from "@orca-wallet/shared";

type TokenIconProps = {
    token: NativeBalance | TokenBalance;
    size?: number;
};

type ActivityTokenIconProps = {
    activity: HistoryResponse;
    size?: number;
};

export function TokenIcon({ token, size = 18 }: TokenIconProps) {
    const { icon, symbol } = getTokenMetada(token);

    return (
        <Image
            src={icon}
            alt={symbol}
            width={size}
            height={size}
            className="h-full w-full rounded-full object-cover"
        />
    );
}

export function ActivityTokenIcon({ activity, size = 18 }: ActivityTokenIconProps) {
    const { isSend, icon, symbol } = getActivityMetadata(activity);

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <Image
                src={icon}
                alt={symbol}
                width={size}
                height={size}
                className="h-full w-full rounded-full object-cover"
            />

            <div className="bg-background absolute -right-1 -bottom-1 flex items-center justify-center rounded-full border shadow-sm">
                <div className="flex h-5 w-5 items-center justify-center">
                    {isSend ? (
                        <IconSend className="text-red-400" size={16} />
                    ) : (
                        <IconDownload className="text-green-400" size={16} />
                    )}
                </div>
            </div>
        </div>
    );
}
