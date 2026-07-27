// import path from "node:path";

// import SwaggerParser from "@apidevtools/swagger-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application, json, urlencoded } from "express";
import helmet from "helmet";
// import swaggerUI from "swagger-ui-express";

import { COMPATIBILITY_CHECK_HEADER } from "@orca-wallet/shared";

// import { appConfig } from "./config";
import { originGuard } from "./middlewares";
import { addApiRoutes } from "./routes";

const corsOptions = {
    origin: originGuard,
    credentials: true,
    exposedHeaders: [COMPATIBILITY_CHECK_HEADER],
};
const urlencodedOptions = {
    extended: true,
};

function createApp(): Application {
    const app = express();

    app.use(json());
    app.use(urlencoded(urlencodedOptions));
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(cookieParser());

    app.set("trust proxy", 1);

    addApiRoutes(app);

    return app;
}

export default createApp();
