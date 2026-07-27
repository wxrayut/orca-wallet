import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";

import { endpoints } from "~/endpoint";

import { AUTH_COOKIE_NAME, OrcaFetcher, type WhoAmI } from "@orca-wallet/shared";

export async function useWhoAmI() {
    unstable_noStore();

    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie) return null;
    if (!authCookie.value) return null;

    try {
        const response = await OrcaFetcher.get<WhoAmI>(endpoints.auth.whoami("v1"), {
            headers: {
                Cookie: `${AUTH_COOKIE_NAME}=${authCookie.value}`,
            },
        });
        return response.data;
    } catch {
        return null;
    }
}
