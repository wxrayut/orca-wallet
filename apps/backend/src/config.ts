import "dotenv/config";

import type { StringValue } from "ms";

import { optionalEnv, requireEnv, requireEnvNumber } from "@orca-wallet/shared";

const config = {
    app: {
        host: requireEnv("APP_HOST"),
        port: requireEnvNumber("APP_PORT"),
        version: requireEnv("APP_VERSION"),
        isProduction: requireEnv("NODE_ENV") === "production",
    },
    security: {
        cors: {
            allowedOrigins: requireEnv("CORS_ALLOWED_ORIGINS").split(","),
        },
        bcrypt: {
            saltRounds: requireEnvNumber("BCRYPT_HASH_SALT"),
        },
        crypto: {
            key: requireEnv("ORCA_ENCRYPTION_KEY"),
        },
        jwt: {
            accessSecret: requireEnv("JWT_ACCESS_SECRET"),
            accessExpiresIn: requireEnv<StringValue>(
                "JWT_ACCESS_TOKEN_EXPIRES_IN",
            ),
            refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
            refreshExpiresIn: requireEnv<StringValue>(
                "JWT_REFRESH_TOKEN_EXPIRES_IN",
            ),
        },
    },
    rpc: {
        providerName: requireEnv("RPC_PROVIDER_NAME"),
        blockchain: requireEnv("RPC_BLOCKCHAIN_NAME"),
        network: requireEnv("RPC_NETWORK_NAME"),
        rpcKey: requireEnv("RPC_API_KEY"),
    },
    mail: {
        resend: {
            apiKey: requireEnv("RESEND_API_KEY"),
            senderEmail: requireEnv("RESEND_SENDER_EMAIL"),
        },
    },
    cache: {
        redis: {
            url: requireEnv("REDIS_URL"),
            host: requireEnv("REDIS_HOST"),
            port: requireEnvNumber("REDIS_PORT"),
        },
    },
    database: {
        url: requireEnv("DATABASE_URL"),
    },
    admin: {
        username: requireEnv("ADMIN_USERNAME"),
        email: requireEnv("ADMIN_EMAIL"),
        password: requireEnv("ADMIN_PASSWORD"),
    },
    github: {
        apiUrl: optionalEnv(
            "GITHUB_API_URL",
            "https://api.github.com",
        ) as string,
        apiVersion: optionalEnv("GITHUB_API_VERSION", "2022-11-28") as string,
        repoOwner: optionalEnv("GITHUB_REPO_OWNER", "wxrayut") as string,
        repoName: optionalEnv("GITHUB_REPO_NAME", "orca-wallet") as string,
        repoToken: optionalEnv("GITHUB_REPO_TOKEN") as string,
    },
};

/* App config for general application settings. */
const appConfig = config.app;

/* CORS config for cross-origin resource sharing. */
const corsConfig = config.security.cors;

/* bcrypt config for password hashing. */
const bcryptConfig = config.security.bcrypt;

/* Crypto config for data encryption. */
const cryptoConfig = config.security.crypto;

/* JWT config for JSON Web Tokens. */
const jwtConfig = config.security.jwt;

/* RPC config for blockchain interactions. */
const rpcConfig = config.rpc;

/* Mail config for email services. */
const mailConfig = config.mail;

/* Cache config for caching layer. */
const cacheConfig = config.cache;

/* Database config for database connection. */
const databaseConfig = config.database;

/* Admin config for default admin user credentials. */
const adminConfig = config.admin;

/* GitHub config for GitHub API interactions. */
const githubConfig = config.github;

export {
    appConfig,
    corsConfig,
    bcryptConfig,
    cryptoConfig,
    jwtConfig,
    rpcConfig,
    mailConfig,
    cacheConfig,
    databaseConfig,
    adminConfig,
    githubConfig,
};
