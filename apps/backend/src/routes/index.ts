import type { Application } from "express";

import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { walletRouter } from "./wallet";

export function addApiRoutes(app: Application) {
    app.use("/api", [authRouter, walletRouter, adminRouter]);
}
