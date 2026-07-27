"use client";

import { createContext } from "react";

import { useMediaQuery } from "~/hooks/system/client";

type ResponsiveContextType = {
    isDesktop: boolean;
    isMobile: boolean;
};

export const ResponsiveContext = createContext<ResponsiveContextType | null>(
    null,
);

export function ResponsiveProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMobile = useMediaQuery(`(max-width: 767px)`);
    const isDesktop = useMediaQuery(`(min-width: 768px)`) || !isMobile;

    return (
        <ResponsiveContext.Provider value={{ isDesktop, isMobile }}>
            {children}
        </ResponsiveContext.Provider>
    );
}
