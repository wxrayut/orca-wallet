"use client";

import * as React from "react";

import { ResponsiveContext } from "~/contexts/system";

export function useResponsive() {
    const ctx = React.useContext(ResponsiveContext);

    if (!ctx) {
        throw new Error("useResponsive must be used inside ResponsiveProvider");
    }

    return ctx;
}
