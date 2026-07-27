"use client";

import { createContext, useEffect, useState } from "react";

type FontContextType = {
    font: string;
    setFont: React.Dispatch<React.SetStateAction<string>>;
};

type FontProviderProps = {
    children: React.ReactNode;
};

export const FontContext = createContext<FontContextType | null>(null);

export function FontProvider({ children }: FontProviderProps) {
    const [font, setFont] = useState<string>("inter");

    useEffect(() => {
        const storedFont = localStorage.getItem("font") as string | null;

        if (storedFont) {
            setFont(storedFont);
        }
    }, []);

    useEffect(() => {
        document.documentElement.dataset.font = font;

        localStorage.setItem("font", font);
    }, [font]);

    return (
        <FontContext.Provider value={{ font, setFont }}>
            {children}
        </FontContext.Provider>
    );
}
