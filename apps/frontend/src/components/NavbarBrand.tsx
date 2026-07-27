"use client";

import Link from "next/link";

import { siteConfig } from "~/site-config";

import { OrcaIcon } from "~/components/OrcaIcon";
import { Separator } from "~/components/ui/separator";

import { useAuth } from "~/hooks";

import { Skeleton } from "./ui/skeleton";

export function NavbarBrand() {
    const { user, initializing } = useAuth();

    return (
        <div className="flex items-center justify-center gap-3">
            <Link href={user ? "/portfolio" : "/"}>
                <OrcaIcon size={48} />
            </Link>

            <Separator orientation="vertical" className="hidden md:block" />

            <div className="flex flex-col">
                <h2 className="text-gradient hidden text-xl font-bold md:block">
                    {siteConfig.siteName}
                </h2>

                <div className="text-caption hidden text-xs md:block">
                    {initializing ? (
                        <Skeleton className="h-3 w-48 rounded-xl" />
                    ) : user ? (
                        `Welcome back, ${user.username}`
                    ) : (
                        siteConfig.description
                    )}
                </div>
            </div>
        </div>
    );
}
