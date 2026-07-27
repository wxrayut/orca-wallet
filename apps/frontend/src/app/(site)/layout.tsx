import { redirect } from "next/navigation";

import { NavbarAction } from "~/components/NavbarAction";
import { NavbarBrand } from "~/components/NavbarBrand";
import { RadialGlow, RadialGrid } from "~/components/decorative";
import { Header } from "~/components/sections";

import { useWhoAmI } from "~/hooks/system/server";

import { AuthContextState, Role } from "@orca-wallet/shared";

export default async function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const whoami = await useWhoAmI();

    if (whoami) {
        const { state, role } = whoami;
        if (state === AuthContextState.AUTHORIZED) {
            redirect(role === Role.ADMIN ? "/admin/dashboard" : "/portfolio");
        }
    }

    return (
        <div className="flex h-screen flex-col">
            <Header>
                <NavbarBrand />
                <NavbarAction />
            </Header>
            <RadialGlow />
            <RadialGrid />

            <main className="flex-1 overflow-auto">
                <div className="flex h-full items-center justify-center">
                    {children}
                </div>
            </main>
        </div>
    );
}
