"use client";

import * as React from "react";

import { AdminContext } from "~/contexts";

export function useAdmin() {
    const ctx = React.useContext(AdminContext);

    if (!ctx) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }

    return ctx;
}
