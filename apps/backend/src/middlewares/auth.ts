import type { NextFunction, Request, Response } from "express";

import { AUTH_COOKIE_NAME, type WhoAmI } from "@orca-wallet/shared";

import { OrcaJWT } from "../core";
import { setUserRequest } from "../http";
import { Logger, OrcaResponse } from "../utils";

export function authGuard(request: Request, response: Response, next: NextFunction) {
    const auth = request.cookies[AUTH_COOKIE_NAME];

    if (!auth) {
        return OrcaResponse.Unauthorized(response);
    }

    try {
        const whoami = OrcaJWT.fastVerify<WhoAmI>(auth);

        if (!whoami) {
            return OrcaResponse.Unauthorized(response);
        }

        setUserRequest(request, whoami);
        next();
    } catch (error) {
        Logger.error(error);

        return OrcaResponse.Unauthorized(response);
    }
}
