import "dotenv/config";

import { Server } from "node:http";

import app from "./app";
import { appConfig, rpcConfig } from "./config";
import { prisma, redis } from "./lib";
import { listener } from "./listeners";
import { Logger, setupAdmin, shutdown } from "./utils";

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGHUP"] as const;

async function bootstrap(port: number): Promise<Server> {
    Logger.enter("Server", "Starting server...");

    try {
        Logger.enter("Server", "Connecting to database...");
        await prisma.$connect();
        Logger.exit("Server", "Database connected successfully.");

        Logger.enter("Server", "Connecting to Redis...");
        await redis.ping();
        Logger.exit("Server", "Redis connected successfully.");

        Logger.enter("Server", "Starting listeners...");
        listener.start();
        Logger.exit("Server", "Listeners started successfully.");

        Logger.enter("Server", "Setting up admin user...");
        await setupAdmin();
        Logger.exit("Server", "Admin user setup completed.");
    } catch (error) {
        Logger.error("Server", "Failed to initialize server:", error);
    }

    Logger.success("Server", "Initialization complete. Starting HTTP server...");

    return app.listen(port, () => {
        Logger.success(
            "Server",
            `Server is running on http://${appConfig.host}:${appConfig.port}`,
        );
        Logger.success(
            "Server",
            `API documentation available at http://${appConfig.host}:${appConfig.port}/docs`,
        );
        Logger.success(
            "Server",
            `RPC provider: ${rpcConfig.providerName} (${rpcConfig.blockchain} - ${rpcConfig.network})`,
        );
        Logger.success("Server", `Press Ctrl+C to stop the server`);
        Logger.exit("Server", "Ready to accept requests.");
    });
}

process.on("unhandledRejection", (reason) => {
    Logger.error("Server", "Unhandled Rejection:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    Logger.error("Server", "Uncaught Exception:", error);
    process.exit(1);
});

signals.forEach((signal) => {
    process.on(signal, () => shutdown(signal));
});

bootstrap(appConfig.port).catch((error) => {
    Logger.error("Server", "Failed to start server:", error);
    process.exit(1);
});
