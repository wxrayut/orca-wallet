import Link from "next/link";

import { IconLayoutDashboard, IconUsers, IconWallet } from "@tabler/icons-react";

import { UserProfile } from "~/components/UserProfile";
import {
    Sidebar as ShadCNSidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar";

import { cn } from "~/lib/utils";

type SidebarProps = {};

export default function Sidebar({}: SidebarProps) {
    return (
        <ShadCNSidebar collapsible="icon">
            <SidebarContent>
                {menus.map((group) => (
                    <SidebarGroup key={group.group}>
                        <SidebarGroupLabel>{group.group}</SidebarGroupLabel>

                        <SidebarMenu>
                            {group.items.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "rounded-lg transition-colors",
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </ShadCNSidebar>
    );
}

const menus = [
    {
        group: "General",
        items: [
            {
                title: "Dashboard",
                href: "/admin/dashboard",
                icon: IconLayoutDashboard,
            },
        ],
    },
    {
        group: "Management",
        items: [
            {
                title: "Users",
                href: "/admin/users",
                icon: IconUsers,
            },
        ],
    },
];
