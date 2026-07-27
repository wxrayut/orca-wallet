import type { NextRequest } from "next/server";

export interface OrcaRedirectOptions {
    to: string;
    request: NextRequest;
}
