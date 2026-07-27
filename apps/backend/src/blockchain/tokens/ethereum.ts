import { TokenStandard } from "@prisma/client";

export const ethereum = {
    mainnet: [
        {
            symbol: "USDT",
            label: "Tether USD",
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            decimals: 6,
            standard: TokenStandard.ERC20,
        },
        {
            symbol: "USDC",
            label: "USD Coin",
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            decimals: 6,
            standard: TokenStandard.ERC20,
        },
        {
            symbol: "SHIB",
            label: "Shiba Inu",
            address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
            decimals: 18,
            standard: TokenStandard.ERC20,
        },
        {
            symbol: "UNI",
            label: "Uniswap",
            address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            decimals: 18,
            standard: TokenStandard.ERC20,
        },
        {
            symbol: "AAVE",
            label: "Aave",
            address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
            decimals: 18,
            standard: TokenStandard.ERC20,
        },
    ],
    sepolia: [
        {
            symbol: "USDC",
            label: "USDC (Sepolia)",
            address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
            decimals: 6,
            standard: TokenStandard.ERC20,
        },
    ],
};
