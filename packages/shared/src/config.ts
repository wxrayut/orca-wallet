import { TokenStandard } from "./types";

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
export const AUTH_COOKIE_NAME = "token";

/**
 * Network configurations for supported blockchains.
 *
 * Each network includes its name, chain ID, and blockchain identifier.
 * This information is used for wallet management and blockchain interactions.
 */
export const NETWORKS = [
    {
        name: "Ethereum",
        chainId: 1,
        blockchain: "ethereum",
        tokenStandard: TokenStandard.ERC20,
    },
    {
        name: "BNB Smart Chain",
        chainId: 56,
        blockchain: "bsc",
        tokenStandard: null,
    },
    {
        name: "Polygon",
        chainId: 137,
        blockchain: "polygon",
        tokenStandard: null,
    },
    {
        name: "Arbitrum One",
        chainId: 42161,
        blockchain: "arbitrum",
        tokenStandard: null,
    },
    {
        name: "Optimism",
        chainId: 10,
        blockchain: "optimism",
        tokenStandard: null,
    },
    {
        name: "Base",
        chainId: 8453,
        blockchain: "base",
        tokenStandard: null,
    },
    {
        name: "Avalanche C-Chain",
        chainId: 43114,
        blockchain: "avalanche",
        tokenStandard: null,
    },
];

/**
 * Icons for supported blockchains and tokens.
 *
 * Each icon includes the name of the blockchain or token and a link to its image.
 * These icons are used in the UI to visually represent different blockchains and tokens.
 */
export const TOKEN_ICONS = [
    {
        name: "Ethereum",
        link: "https://token-icons.s3.amazonaws.com/eth.png",
    },
    {
        name: "USDT",
        link: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
        name: "USDC",
        link: "https://coin-images.coingecko.com/coins/images/6319/large/USDC.png?1769615602",
    },
    {
        name: "SHIB",
        link: "https://coin-images.coingecko.com/coins/images/11939/large/shiba.png?1696511800",
    },
    {
        name: "UNI",
        link: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
    },
    {
        name: "AAVE",
        link: "https://coin-images.coingecko.com/coins/images/12645/large/aave-token-round.png?1720472354",
    },
];
