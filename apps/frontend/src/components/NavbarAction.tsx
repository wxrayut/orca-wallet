"use client";

import { useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconGitBranch, IconMenu2, IconStar } from "@tabler/icons-react";

import { siteConfig } from "~/site-config";

import { useDisclosure, useMediaQuery, useResponsive } from "~/hooks/system/client";

import { cn } from "~/lib/utils";

import { ThemeToggle } from "./ThemeToggle";
import { ButtonLink, Drawer } from "./primitives";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export function NavbarAction() {
    const { isDesktop } = useResponsive();
    const { isOpen, setOpen, onClose } = useDisclosure(false);

    const pathname = usePathname();
    const isCompact = useMediaQuery("(max-width: 1200px)");

    useEffect(() => {
        if (!isCompact && isOpen) {
            onClose();
        }
    }, [isCompact, isOpen, onClose]);

    return (
        <div className="flex items-center gap-3">
            <div className="hidden gap-2 md:flex">
                <ButtonLink
                    href="/auth/sign-in"
                    className="rounded-sm text-xs"
                    variant="ghost"
                    useNextLink={true}
                >
                    Sign In
                </ButtonLink>

                <ButtonLink
                    href="/auth/sign-up"
                    className="rounded-sm bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                    useNextLink={true}
                >
                    Sign Up
                </ButtonLink>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {isDesktop ? (
                <>
                    {isCompact ? (
                        <DropdownMenu open={isOpen} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button className="cursor-pointer" variant="ghost">
                                    <IconMenu2 />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="mt-6 w-72 rounded-xs px-4 py-3"
                                align="end"
                                forceMount
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium">
                                            Star us on GitHub
                                        </span>
                                        <div className="text-muted-foreground mt-1 flex items-center gap-2">
                                            <IconStar className="h-3 w-3" />
                                            <span className="text-xs">1000k+</span>
                                        </div>
                                    </div>

                                    <ButtonLink
                                        href={siteConfig.links.github}
                                        target="_blank"
                                        variant="ghost"
                                    >
                                        <IconGitBranch />
                                    </ButtonLink>
                                </div>

                                <DropdownMenuSeparator className="my-3" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Theme
                                    </span>
                                    <ThemeToggle />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <IconStar className="h-3 w-3" />
                                <p className="text-sm text-gray-600 dark:text-white">
                                    1000k+
                                </p>
                            </div>

                            <ButtonLink
                                href={siteConfig.links.github}
                                target="_blank"
                                variant="ghost"
                                size="sm"
                            >
                                <IconGitBranch />
                            </ButtonLink>

                            <Separator orientation="vertical" />

                            <ThemeToggle />
                        </>
                    )}
                </>
            ) : (
                <Drawer
                    triggerVariant="ghost"
                    triggerContent={<IconMenu2 />}
                    headerTitle={siteConfig.siteName}
                    headerDescription={siteConfig.description}
                    disableFooter
                >
                    <div className="flex h-full flex-col gap-6 p-6">
                        <ul className="space-y-1">
                            {siteConfig.navItems.guest.map((item) => {
                                const active =
                                    pathname === item.href ||
                                    pathname.startsWith(item.href + "/");

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "nav-link-mobile",
                                                active && "nav-link-mobile-active",
                                            )}
                                        >
                                            {active && (
                                                <span className="nav-link-indicator" />
                                            )}
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-6 p-6">
                        <div className="flex w-full items-center justify-between gap-2">
                            <div>
                                <span className="text-sm font-medium">
                                    Star us on GitHub
                                </span>
                                <div className="text-muted-foreground mt-1 flex items-center gap-2">
                                    <IconStar className="h-3 w-3" />
                                    <span className="font-mono text-xs">1000k+</span>
                                </div>
                            </div>

                            <ButtonLink
                                href={siteConfig.links.github}
                                target="_blank"
                                variant="ghost"
                            >
                                <IconGitBranch />
                            </ButtonLink>
                        </div>

                        <div className="flex w-full items-center justify-between">
                            <span className="text-sm font-medium">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </Drawer>
            )}
        </div>
    );
}
