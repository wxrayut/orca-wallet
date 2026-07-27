import type { Env } from "../types";

/**
 * Requires an environment variable to be set and returns its value.
 *
 * @param key The name of the environment variable to require.
 * @returns The value of the environment variable.
 *
 * @throws If the environment variable is not set or is an empty string.
 */
export function requireEnv<T extends Env = string>(key: string): T {
    const value = process.env[key];

    if (!value || value.length === 0) {
        throw new Error(`Environment variable ${key} is required`);
    }

    return value as T;
}

/**
 * Requires an environment variable and parses it as a number.
 *
 * @param key The name of the environment variable to require.
 * @returns The value of the environment variable parsed as a number.
 *
 * @throws If the environment variable is not set or cannot be parsed as a number.
 */
export function requireEnvNumber(key: string): number {
    const value = requireEnv(key);
    const num = Number(value);

    if (Number.isNaN(num)) {
        throw new Error(`Environment variable ${key} must be a number`);
    }

    return num;
}

/**
 * Retrieves an optional environment variable, returning a default value if it is not set.
 *
 * @param key The name of the environment variable to retrieve.
 * @param defaultValue The default value to return if the environment variable is not set.
 * @returns The value of the environment variable, or the default value if it is not set.
 */
export function optionalEnv<T extends Env = string>(
    key: string,
    defaultValue?: T,
): T | undefined {
    const value = process.env[key];

    if (value === undefined || value.length === 0) {
        return defaultValue;
    }

    return value as T;
}
