import type { Response } from "express";

import type { ResponseBody, ResponseOptions } from "@orca-wallet/shared";

import type { CookieOptions } from "../types";

export class OrcaResponse<T extends object | object[] = {}> {
    private readonly response: Response;
    private readonly body: ResponseBody<T>;

    private cookieOptions: CookieOptions = {};

    constructor(response: Response, body: ResponseBody<T>) {
        this.response = response;
        this.body = body;
    }

    private static error(res: Response, status: number, msg: Error | string) {
        return new OrcaResponse(res, {
            status,
            success: false,
            message: msg instanceof Error ? msg.message : msg,
        }).send();
    }

    public header(name: string, value: string): this {
        this.response.setHeader(name, value);
        return this;
    }

    public cookie(name: string, value: string, options?: CookieOptions): this {
        this.response.cookie(name, value, {
            ...this.cookieOptions,
            ...options,
        });
        return this;
    }

    public delete(name: string, options?: CookieOptions): this {
        this.response.clearCookie(name, { ...this.cookieOptions, ...options });
        return this;
    }

    public clear(name: string): this {
        return this.delete(name);
    }

    public domain(domain: string): this {
        this.cookieOptions.domain = domain;
        return this;
    }

    public httpOnly(value: boolean = true): this {
        this.cookieOptions.httpOnly = value;
        return this;
    }

    public maxAge(seconds: number): this {
        this.cookieOptions.maxAge = seconds * 1000;
        return this;
    }

    public path(value: string = "/"): this {
        this.cookieOptions.path = value;
        return this;
    }

    public sameSite(value: CookieOptions["sameSite"] = "strict"): this {
        this.cookieOptions.sameSite = value;
        return this;
    }

    public secure(value: boolean = true): this {
        this.cookieOptions.secure = value;
        return this;
    }

    public send(): Response {
        return this.response.status(this.body.status).json(this.body);
    }

    public static Ok<T extends object | object[] = {}>(
        res: Response,
        body: Partial<ResponseBody<T>>,
    ) {
        const message = body.message || "OK";
        const data = body.data;

        return new OrcaResponse<T>(res, {
            status: 200,
            message,
            success: true,
            data,
        });
    }

    public static Created<T extends object | object[] = {}>(
        res: Response,
        body: Partial<ResponseBody<T>>,
    ) {
        const message = body.message || "Created";
        const data = body.data;

        return new OrcaResponse<T>(res, {
            status: 201,
            message,
            success: true,
            data,
        });
    }

    public static Success<T extends object | object[] = {}>(
        res: Response,
        body: Partial<ResponseBody<T>>,
    ) {
        const message = body.message || "Success";
        const data = body.data;

        return new OrcaResponse<T>(res, {
            status: 200,
            message,
            success: true,
            data,
        }).send();
    }

    public static BadRequest(
        res: Response,
        message: Error | string = "Bad Request",
    ) {
        return this.error(res, 400, message);
    }

    public static Unauthorized(
        res: Response,
        message: Error | string = "Unauthorized",
    ) {
        return this.error(res, 401, message);
    }

    public static Forbidden(res: Response, message: Error | string = "Forbidden") {
        return this.error(res, 403, message);
    }

    public static NotFound(res: Response, message: Error | string = "Not Found") {
        return this.error(res, 404, message);
    }

    public static Conflict(res: Response, message: Error | string = "Conflict") {
        return this.error(res, 409, message);
    }

    public static TooManyRequest(
        res: Response,
        message: Error | string = "Rate limit exceeded",
    ) {
        return this.error(res, 429, message);
    }

    public static ServerError(
        res: Response,
        message: Error | string = "Internal Server Error",
    ) {
        return this.error(res, 500, message);
    }
}
