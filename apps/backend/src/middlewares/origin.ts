import { appConfig, corsConfig } from "../config";

export function originGuard(
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
) {
    if (!appConfig.isProduction) {
        return callback(null, true);
    }

    const allowedOrigins = corsConfig.allowedOrigins;

    if (!origin) {
        return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
        return callback(null, true);
    }

    return callback(new Error(`CORS not allowed: ${origin}`));
}
