import type { Request } from "express";

export class OrcaParser {
    static parse<T>(request: Request): T {
        return request.body as T;
    }
}
