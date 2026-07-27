"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
    IconChartPie,
    IconLayoutDashboard,
    IconLogout,
    IconMenu2,
    IconSettings,
} from "@tabler/icons-react";

import { useAuth } from "~/hooks";
import { useResponsive } from "~/hooks/system/client";

import { cn } from "~/lib/utils";

import { Role } from "@orca-wallet/shared";

import { SignOutDialog } from "./SignOutDialog";
import { Drawer } from "./primitives";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export function UserProfile() {
    const router = useRouter();

    const { user, initializing, loading, signOut } = useAuth();
    const { isDesktop } = useResponsive();

    const [isSigningOutDialogOpen, setSigningOutDialogOpen] = useState(false);

    if (!user || initializing) return <Skeleton className="h-8 w-8 rounded-full" />;

    const initials =
        user.username?.slice(0, 2).toUpperCase() ??
        user.email?.slice(0, 2).toUpperCase() ??
        "OW";

    const onConfirmSignOut = async () => {
        if (await signOut()) {
            setSigningOutDialogOpen(false);
            router.push("/");
        }
    };

    return isDesktop ? (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 cursor-pointer rounded-full"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="mt-1 w-56 rounded-md"
                    align="end"
                    forceMount
                >
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col gap-1.5">
                                <p className="text-foreground text-sm leading-none font-medium">
                                    {user.username}
                                </p>

                                <p className="text-muted-foreground text-xs leading-none">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        {menus.map((menu) => {
                            if (
                                user.role === Role.USER &&
                                menu.role === Role.ADMIN
                            ) {
                                return null;
                            }

                            return (
                                <div key={menu.href}>
                                    {menu.role === Role.ADMIN && (
                                        <DropdownMenuSeparator />
                                    )}

                                    <DropdownMenuItem key={menu.href} asChild>
                                        <a
                                            href={menu.href}
                                            className="cursor-pointer"
                                        >
                                            <menu.icon className="me-1" />
                                            {menu.label}
                                            <DropdownMenuShortcut>
                                                {menu.shortcut}
                                            </DropdownMenuShortcut>
                                        </a>
                                    </DropdownMenuItem>
                                </div>
                            );
                        })}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => setSigningOutDialogOpen(true)}
                    >
                        <IconLogout className="me-1" />
                        Sign out
                        <DropdownMenuShortcut className="text-current">
                            ⇧⌘Q
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SignOutDialog
                open={isSigningOutDialogOpen}
                onOpenChange={setSigningOutDialogOpen}
                onConfirm={onConfirmSignOut}
                loading={loading}
            />
        </>
    ) : (
        <Drawer
            triggerVariant="ghost"
            triggerClassName="rounded-md"
            triggerContent={<IconMenu2 />}
            headerTitle={user.username}
            headerDescription={user.email}
            onConfirm={onConfirmSignOut}
            confirmTriggerVariant="destructive"
            confirmTriggerContent="Sign out"
        >
            <ScrollArea className="flex h-70 flex-col gap-2 md:h-75">
                {menus.map((menu) => {
                    const isActive = window.location.pathname === menu.href;

                    if (user.role === Role.USER && menu.role === Role.ADMIN) {
                        return null;
                    }

                    return (
                        <a
                            key={menu.href}
                            href={menu.href}
                            className={cn(
                                "group mt-2 flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all",
                                "hover:bg-muted/50",
                                isActive
                                    ? "bg-primary/5 border-blue-500"
                                    : "border-border",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg",
                                        isActive
                                            ? "bg-blue-500/10 text-blue-500"
                                            : "bg-muted",
                                    )}
                                >
                                    <menu.icon
                                        className={cn(
                                            "h-4 w-4",
                                            isActive
                                                ? "text-blue-500"
                                                : "text-muted-foreground",
                                        )}
                                    />
                                </div>

                                <span className="text-sm font-light">
                                    {menu.label}
                                </span>
                            </div>
                        </a>
                    );
                })}
            </ScrollArea>
        </Drawer>
    );
}

const menus = [
    {
        icon: IconChartPie,
        label: "Portfolio",
        href: "/portfolio",
        shortcut: "⇧⌘P",
        role: Role.USER,
    },
    {
        icon: IconSettings,
        label: "Settings",
        href: "/settings",
        shortcut: "⌘S",
        role: Role.USER,
    },
    {
        icon: IconLayoutDashboard,
        label: "Dashboard",
        href: "/admin/dashboard",
        shortcut: "⇧⌘D",
        role: Role.ADMIN,
    },
];
