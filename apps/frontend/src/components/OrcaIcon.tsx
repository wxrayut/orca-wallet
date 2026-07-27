"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import Image from "next/image";

import { cn } from "~/lib/utils";

type OrcaIconProps = {
    size?: number;
    className?: string;
    animated?: boolean;
};

export function OrcaIcon({ size = 32, className, animated }: OrcaIconProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Image
            src={theme === "dark" ? "/icons/orca_dark.png" : "/icons/orca_light.png"}
            alt="Orca Icon"
            width={size}
            height={size}
            className={cn(animated && "animate-bounce-slow", className)}
        />
    );
}
