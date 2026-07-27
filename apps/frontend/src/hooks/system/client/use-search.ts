"use client";

import * as React from "react";

import { SearchContext } from "~/contexts/system";

export function useSearch() {
    const ctx = React.useContext(SearchContext);

    if (!ctx) {
        throw new Error("useSearch must be used inside SearchProvider");
    }

    return ctx;
}
