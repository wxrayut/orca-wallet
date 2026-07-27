/**
 * Current API version string.
 *
 * Used for routing and versioning API endpoints
 * (e.g., /api/v1).
 */
export const API_VERSION = "v1";

/**
 * Compatibility check version number.
 *
 * Increment this value when introducing breaking changes
 * that require clients to update.
 */
export const COMPATIBILITY_CHECK = 1;

/**
 * HTTP header name for client compatibility verification.
 *
 * Clients must send this header with the expected
 * compatibility version to ensure API support.
 */
export const COMPATIBILITY_CHECK_HEADER = "X-Compatibility-Check";

/**
 * Name of the authentication cookie used to store the session token.
 *
 * This cookie is sent with each request to authenticate the user.
 */
export const AUTH_COOKIE_NAME = "R7rwaNg0gKu9s8n";

/** Duration for which the authentication cookie remains valid.
 *
 * This includes both the JWT expiration time and the cookie's max age.
 * The JWT expiration is set to 7 days, while the cookie's max age is set to 30 days
 * to allow for session persistence even if the JWT is refreshed.
 */
export const AUTH_COOKIE_LIFE_TIME = {
    JWT: {
        OTP: "10m",
        ACCESS_7D: "7d",
        ACCESS_30D: "30d",
    },
    MS: {
        MINUTE: 60 * 1000,
        DAY: 24 * 60 * 60 * 1000,
        OTP: 10 * 60 * 1000, // 10 minutes
        D7: 7 * 24 * 60 * 60 * 1000,
        D30: 30 * 24 * 60 * 60 * 1000,
    },
} as const;

/** Supported blockchain networks and their configurations.
 *
 * Each network includes its name, chain ID, CoinGecko ID for price fetching,
 * and the symbol of its native token.
 */
export const NETWORKS = {
    ETHEREUM: {
        name: "Ethereum",
        symbol: "ETH",
        chainId: 1,
        coingeckoId: "ethereum",
    },
    POLYGON: {
        name: "Polygon",
        symbol: "MATIC",
        chainId: 137,
        coingeckoId: "polygon",
    },
    BSC: {
        name: "Binance Smart Chain",
        symbol: "BNB",
        chainId: 56,
        coingeckoId: "binancecoin",
    },
    /* Add more networks as needed */
} as const;

/** Mapping of token symbols to their corresponding icon URLs.
 *
 * This is used to display token icons in the UI based on their symbol.
 * The URLs point to hosted images of the token logos.
 */
export const TOKEN_ICONS: Record<string, string> = {
    default: "",
    multiple: "",
    ETH: "https://token-icons.s3.amazonaws.com/eth.png",
    USDT: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    USDC: "https://coin-images.coingecko.com/coins/images/6319/large/USDC.png?1769615602",
    SHIB: "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800",
    UNI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
    AAVE: "https://coin-images.coingecko.com/coins/images/12645/large/aave-token-round.png?1720472354",
};

/** Mapping of token symbols to their corresponding CoinGecko IDs.
 *
 * This is used to fetch token price data from the CoinGecko API based on their symbol.
 */
export const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
    ETH: "ethereum",
    USDC: "usd-coin",
    USDT: "tether",
    SHIB: "shiba-inu",
    UNI: "uniswap",
    AAVE: "aave",
};

/** Reverse mapping of CoinGecko IDs to token symbols.
 *
 * This is used to convert CoinGecko IDs back to token symbols when processing API responses.
 */
export const COINGECKO_ID_TO_SYMBOL = Object.fromEntries(
    Object.entries(SYMBOL_TO_COINGECKO_ID).map(([k, v]) => [v, k]),
);

/** Mapping of token symbols to their human-readable names.
 *
 * This is used to display the full name of a token in the UI based on its symbol.
 */
export const SYMBOL_TO_NAME: Record<string, string> = {
    ETH: "Ethereum",
    USDC: "USD Coin",
    USDT: "Tether",
    SHIB: "Shiba Inu",
    UNI: "Uniswap",
    AAVE: "Aave",
};
