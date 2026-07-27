import { headers } from "next/headers";

export async function usePath() {
    const headersStore = await headers();
    return headersStore.get("x-current-path") || "/";
}
