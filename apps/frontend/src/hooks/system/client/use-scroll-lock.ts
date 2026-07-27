"use client";

import * as React from "react";

export function useScrollLock(locked: boolean) {
    React.useEffect(() => {
        const originalOverflow = window.getComputedStyle(
            document.body
        ).overflow;

        if (locked) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [locked]);
}
