/* Base API URL from environment variable. */
const BASE_API = process.env.NEXT_PUBLIC_BASE_API_URL;

/* API prefix constant. */
const API_PREFIX = "api";

/* Helper function to construct the full API URL for a given version and path. */
const apiUrl = (version: string, path: string) => {
    if (!version.startsWith("v")) {
        throw new Error("Invalid API version. Must start with 'v', e.g., 'v1'.");
    }

    return `${BASE_API}/${API_PREFIX}/${version}/${path}`;
};

export const endpoints = {
    auth: {
        signIn: (version: string) => apiUrl(version, "auth/sign-in"),
        signUp: (version: string) => apiUrl(version, "auth/sign-up"),
        sendOtp: (version: string) => apiUrl(version, "auth/send-otp"),
        verifyOtp: (version: string) => apiUrl(version, "auth/verify-otp"),
        whoami: (version: string) => apiUrl(version, "auth/whoami"),
        me: (version: string) => apiUrl(version, "auth/me"),
        signOut: (version: string) => apiUrl(version, "auth/sign-out"),
    },
    wallet: {
        create: (version: string) => apiUrl(version, "wallet/create"),
        import: (version: string) => apiUrl(version, "wallet/import"),
        send: (version: string) => apiUrl(version, "wallet/send"),
        get: {
            balance: (version: string) => apiUrl(version, "wallet/balance"),
            privateKey: (version: string) => apiUrl(version, "wallet/private-key"),
            tokens: (version: string) => apiUrl(version, "wallet/tokens"),
            activities: (version: string) => apiUrl(version, `wallet/activity`),
            tokenPrices: (version: string) => apiUrl(version, `wallet/token-price`),
        },
        wallets: (version: string) => apiUrl(version, "wallets"),
        update: {
            label: (version: string) => apiUrl(version, "wallet/update-label"),
            default: (version: string) => apiUrl(version, "wallet/update-default"),
        },
        delete: (version: string) => apiUrl(version, "wallet/delete"),
    },
    admin: {
        dashboard: {
            state: (version: string) => apiUrl(version, "admin/stats"),
            recentTransactions: (version: string) =>
                apiUrl(version, "admin/recent-transactions"),
        },
        users: {
            list: (version: string) => apiUrl(version, "admin/users"),
            update: (version: string) => apiUrl(version, "admin/update-user"),
            delete: (version: string) => apiUrl(version, "admin/delete-user"),
        },
    },
};
