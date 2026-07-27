import { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { getUserRequest } from "../http";
import { OrcaResponse } from "../utils";

export function adminGuard(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const whoami = getUserRequest(request);

    if (!whoami || whoami.role !== Role.ADMIN) {
        return OrcaResponse.Forbidden(
            response,
            "You do not have permission to access this resource.",
        );
    }

    next();
}
