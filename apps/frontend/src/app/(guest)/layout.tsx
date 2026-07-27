import { redirect } from "next/navigation";

import { NavbarAction } from "~/components/NavbarAction";
import { NavbarBrand } from "~/components/NavbarBrand";
import { RadialGlow, RadialGrid } from "~/components/decorative";
import { Header } from "~/components/sections";
import { NotFound } from "~/components/system";

import { usePath, useWhoAmI } from "~/hooks/system/server";

import { AuthContextState, Role } from "@orca-wallet/shared";

export default async function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = await usePath();
    const whoami = await useWhoAmI();

    const isVerifyingOTPRoute = pathname.startsWith("/auth/verify-otp");

    if (!whoami && isVerifyingOTPRoute) {
        return <NotFound />;
    }

    if (whoami) {
        const { state, role } = whoami;
        if (state === AuthContextState.AUTHORIZED) {
            redirect(role === Role.ADMIN ? "/admin/dashboard" : "/portfolio");
        }
    }

    return (
        <div className="flex h-screen flex-col">
            <RadialGlow />
            <RadialGrid />
            {/* Hide header on OTP verification page. */}
            {!isVerifyingOTPRoute && (
                <Header>
                    <NavbarBrand />
                    <NavbarAction />
                </Header>
            )}

            <main className="flex-1 overflow-auto">
                <div className="flex h-full items-center justify-center">
                    {children}
                </div>
            </main>
        </div>
    );
}
