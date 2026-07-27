"use client";

/**
 * This file includes code adapted from the shadcn-admin project
 * by satnaing (https://github.com/satnaing/shadcn-admin).
 *
 * https://github.com/satnaing/shadcn-admin/blob/main/src/components/layout/header.tsx
 *
 * Licensed under the original project's license.
 */
import { useEffect, useState } from "react";

import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

import { cn } from "~/lib/utils";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
    fixed?: boolean;
    ref?: React.Ref<HTMLElement>;
};

export default function Header({
    className,
    fixed,
    children,
    ...props
}: HeaderProps) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            setOffset(document.body.scrollTop || document.documentElement.scrollTop);
        };

        // Add scroll listener to the body
        document.addEventListener("scroll", onScroll, { passive: true });
        // Clean up the event listener on unmount
        return () => document.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "bg-card z-50 h-16 border-b",
                fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
                offset > 10 && fixed ? "shadow" : "shadow-none",
                className,
            )}
            {...props}
        >
            <div
                className={cn(
                    "relative flex h-full items-center gap-3 p-4 sm:gap-4",
                    offset > 10 &&
                        fixed &&
                        "after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg",
                )}
            >
                <SidebarTrigger
                    variant="outline"
                    className="cursor-pointer rounded-md max-md:scale-125"
                />

                <Separator orientation="vertical" className="h-8" />

                {children}
            </div>
        </header>
    );
}
