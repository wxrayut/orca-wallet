import { FetchOptions, ResponseBody } from "../types";

/**
 * HTTP utility class built on top of the Fetch API.
 *
 * Provides typed methods for GET, POST, PUT, PATCH, and DELETE requests.
 * Requests are sent with `credentials: "include"` and
 * `Content-Type: application/json` by default.
 *
 * By default, responses are assumed to conform to `ResponseBody<T>`.
 * This behavior can be disabled via the `unwrap` option when the API
 * returns raw data.
 *
 * Generic type parameters:
 * - `T`: The expected shape of the response data (default is an empty object).
 * - `B`: The expected shape of the request body (default is unknown).
 * - `Wrapped`: A boolean indicating whether the response is wrapped in a ResponseBody (default is true).
 *
 * Example::
 *
 * ```ts
 *
 * type User = {
 *   id: number;
 *   name: string;
 * };
 *
 * // Fetching a wrapped response
 * const wrapped = await OrcaFetcher.get<User>("/api/user");
 * // wrapped.data.name;
 *
 * // Fetching an unwrapped response
 * const raw = await OrcaFetcher.fetch<User, unknown, false>(
 *  "/api/raw-data", {
 *      unwrap: false
 *  });
 * // raw.name;
 * ```
 */

export class OrcaFetcher {
    static async fetch<
        T extends object | object[] = {},
        B = unknown,
        Wrapped extends boolean = true,
    >(
        url: string,
        options: FetchOptions<B> & { unwrap?: Wrapped } = {},
    ): Promise<Wrapped extends true ? ResponseBody<T> : T> {
        const { body, headers, unwrap = true, ...rest } = options;
        const response = await fetch(url, {
            ...rest,
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        });

        return (await response.json()) as Wrapped extends true
            ? ResponseBody<T>
            : T;
    }

    static async get<T extends object | object[] = {}>(
        url: string,
        options: Omit<RequestInit, "method" | "body"> = {},
    ): Promise<ResponseBody<T>> {
        return this.fetch<T>(url, {
            ...options,
            method: "GET",
        });
    }

    static async post<T extends object | object[] = {}, B = object | null>(
        url: string,
        body?: B,
        options: Omit<RequestInit, "body" | "method"> = {},
    ): Promise<ResponseBody<T>> {
        return this.fetch<T, B>(url, {
            ...options,
            method: "POST",
            ...(body !== undefined ? { body } : {}),
        });
    }

    static async put<T extends object | object[] = {}, B = object | null>(
        url: string,
        body?: B,
        options: Omit<RequestInit, "body" | "method"> = {},
    ): Promise<ResponseBody<T>> {
        return this.fetch<T, B>(url, {
            ...options,
            method: "PUT",
            ...(body !== undefined ? { body } : {}),
        });
    }

    static async patch<T extends object | object[] = {}, B = object | null>(
        url: string,
        body?: B,
        options: Omit<RequestInit, "body" | "method"> = {},
    ): Promise<ResponseBody<T>> {
        return this.fetch<T, B>(url, {
            ...options,
            method: "PATCH",
            ...(body !== undefined ? { body } : {}),
        });
    }

    static async delete<T extends object | object[] = {}>(
        url: string,
        options: Omit<RequestInit, "method" | "body"> = {},
    ): Promise<ResponseBody<T>> {
        return this.fetch<T>(url, {
            ...options,
            method: "DELETE",
        });
    }
}
