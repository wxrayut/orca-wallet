"use client";

import * as React from "react";

import { FontContext } from "~/contexts/system";

export function useFont() {
    const ctx = React.useContext(FontContext);

    if (!ctx) {
        throw new Error("useFont must be used inside FontProvider");
    }

    return ctx;
}
