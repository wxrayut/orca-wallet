import {
    IconBook,
    IconChartPie,
    IconFileText,
    IconHome,
    IconLayoutDashboard,
    IconNews,
    IconSettings,
    IconWallet,
} from "@tabler/icons-react";

import { Role } from "@orca-wallet/shared";

export const siteConfig = {
    siteName: "Orca Wallet",
    description: "A crypto wallet for the Ethereum ocean",
    url: "https://orca-wallet.xyz",
    defaultLanguage: "en",
    links: {
        github: "https://www.github.com/wxrayut/orca-wallet",
    },
    navItems: {
        guest: [
            {
                icon: IconHome,
                label: "Home",
                href: "/",
            },
            {
                icon: IconWallet,
                label: "Features",
                href: "/#features",
            },
            {
                icon: IconBook,
                label: "Docs",
                href: "/docs",
            },
            {
                icon: IconNews,
                label: "Blog",
                href: "/blog",
            },
            {
                icon: IconFileText,
                label: "Changelog",
                href: "/changelog",
            },
        ],
        auth: [
            {
                icon: IconChartPie,
                label: "Portfolio",
                href: "/portfolio",
                roles: [Role.USER, Role.ADMIN],
            },
            {
                icon: IconLayoutDashboard,
                label: "Dashboard",
                href: "/dashboard",
                roles: [Role.ADMIN],
            },
            {
                icon: IconSettings,
                label: "Settings",
                href: "/settings",
                roles: [Role.USER, Role.ADMIN],
            },
        ],
    },
};
