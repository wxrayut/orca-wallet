"use client";

import { useState } from "react";

import { IconSearch } from "@tabler/icons-react";

import { useSearch } from "~/hooks/system/client";

import { cn } from "~/lib/utils";

type SearchProps = {
    className?: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
};

export default function Search({
    className = "",
    placeholder = "Search",
}: SearchProps) {
    const { setOpen } = useSearch();
    const [focused, setFocused] = useState(false);

    return (
        <div
            className={cn(
                "relative flex w-full items-center",
                focused ? "md:w-72" : "md:w-56",
                "transition-all duration-200",
                className,
            )}
        >
            <IconSearch
                size={16}
                className="text-muted-foreground pointer-events-none absolute left-3"
            />

            <input
                type="text"
                placeholder={placeholder}
                onFocus={() => {
                    setFocused(true);
                    setOpen(true);
                }}
                onBlur={() => {
                    setFocused(false);
                }}
                className={cn(
                    "bg-muted/30 border-border text-sm",
                    "placeholder:text-muted-foreground",
                    "h-9 w-full cursor-pointer rounded-lg border pr-14 pl-9 outline-none",
                )}
            />

            <kbd className="text-muted-foreground bg-muted/50 absolute right-2 hidden h-5 items-center gap-1 rounded border px-1.5 text-[10px] sm:flex">
                <span className="text-xs">⌘</span>K
            </kbd>
        </div>
    );
}
