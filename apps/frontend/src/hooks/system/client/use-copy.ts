"use client";

import * as React from "react";

export function useCopy(text: string) {
    const [isCopied, setCopied] = React.useState(false);

    const copyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);

    return { isCopied, copyToClipboard };
}
