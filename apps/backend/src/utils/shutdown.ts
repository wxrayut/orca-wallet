import { prisma, redis } from "../lib";
import { listener } from "../listeners";

import { Logger } from "./logger";

export async function shutdown(signal: NodeJS.Signals) {
    Logger.enter("Server", `Received ${signal}. Shutting down gracefully...`);

    try {
        Logger.enter("Server", "Disconnecting from database...");
        await prisma.$disconnect();
        Logger.exit("Server", "Database disconnected successfully.");

        Logger.enter("Server", "Disconnecting from Redis...");
        await redis.quit();
        Logger.exit("Server", "Redis disconnected successfully.");

        Logger.enter("Server", "Stopping listeners...");
        listener.stop();
        Logger.exit("Server", "Listeners stopped successfully.");
    } catch (error) {
        Logger.error("Server", "Error during shutdown:", error);
    }

    Logger.exit("Shutdown", "Shutdown complete. Exiting process.");

    process.exit(0);
}
