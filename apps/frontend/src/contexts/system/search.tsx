"use client";

import { createContext, useState } from "react";

import { CommandMenu } from "~/components/CommandMenu";

type SearchContextType = {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AuthProviderProps = {
    children: React.ReactNode;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: AuthProviderProps) {
    const [isOpen, setOpen] = useState(false);

    return (
        <SearchContext.Provider value={{ isOpen, setOpen }}>
            {children}
            <CommandMenu />
        </SearchContext.Provider>
    );
}
