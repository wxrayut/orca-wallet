import { Redis } from "ioredis";

import { cacheConfig } from "../config";

export const redis = new Redis({
    host: cacheConfig.redis.host,
    port: cacheConfig.redis.port,
});
