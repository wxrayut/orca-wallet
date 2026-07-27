import type { Request } from "express";

import type { WhoAmI } from "@orca-wallet/shared";

export function setUserRequest(request: Request, user: WhoAmI) {
    (request as Request & { user: WhoAmI }).user = user;
}

export function getUserRequest(request: Request): WhoAmI {
    return (request as Request & { user: WhoAmI }).user;
}
