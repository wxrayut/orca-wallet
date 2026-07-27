import { redirect } from "next/navigation";

import { NavbarBrand } from "~/components/NavbarBrand";
import { UserProfile } from "~/components/UserProfile";
import { RadialGlow, RadialGrid } from "~/components/decorative";
import { Header } from "~/components/sections";
import { NotFound } from "~/components/system";

import { usePath, useWhoAmI } from "~/hooks/system/server";

import { AuthContextState, Role } from "@orca-wallet/shared";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = await usePath();
    const whoami = await useWhoAmI();

    const isAdminRoute = pathname.startsWith("/admin");

    if (!whoami) {
        return <NotFound />;
    }

    const { state, role } = whoami;

    if (state === AuthContextState.VERIFY_OTP) {
        redirect("/auth/verify-otp");
    }

    if (isAdminRoute && role === Role.USER) {
        return <NotFound />;
    }

    return (
        <div className="flex h-screen flex-col">
            <RadialGlow />
            <RadialGrid />

            {!isAdminRoute && (
                <Header>
                    <NavbarBrand />
                    <UserProfile />
                </Header>
            )}

            <main className="flex-1 overflow-auto">
                <div className="flex h-full justify-center">{children}</div>
            </main>
        </div>
    );
}
