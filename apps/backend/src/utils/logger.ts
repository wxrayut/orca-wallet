import fs from "node:fs";
import path from "node:path";

import ck from "chalk";

import { LoggerLevel, LoggerStyle } from "../types";

let isEnter: boolean = false;
let indentStack: string[] = [];

const styles: LoggerStyle = {
    ENTER: {
        emoji: "",
        message: ck.green.bold("ENTER   "),
    },
    INFO: {
        emoji: "",
        message: ck.blue.bold("INFO    "),
    },
    SUCCESS: {
        emoji: "",
        message: ck.green.bold("SUCCESS "),
    },
    WARNING: {
        emoji: "",
        message: ck.yellow.bold("WARNING "),
    },
    ERROR: {
        emoji: "",
        message: ck.red.bold("ERROR   "),
    },
    DEBUG: {
        emoji: "",
        message: ck.magenta.bold("DEBUG   "),
    },
    ALERT: {
        emoji: "",
        message: ck.redBright.bold("ALERT   "),
    },
    TRACE: {
        emoji: "",
        message: ck.cyan.bold("TRACE   "),
    },
    EXIT: {
        emoji: "",
        message: ck.green.bold("EXIT    "),
    },
};

function zeroPad(num: number, places: number): string {
    return num.toString().padStart(places, "0");
}

function getTimestamp(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = zeroPad(date.getMonth() + 1, 2);
    const day = zeroPad(date.getDate(), 2);
    const hours = zeroPad(date.getHours(), 2);
    const minutes = zeroPad(date.getMinutes(), 2);
    const seconds = zeroPad(date.getSeconds(), 2);

    return `[${ck.gray.bold(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)}]`;
}

function getCallerMethodName(
    className: string,
    /* depth: number = 4 */
): string | undefined {
    const stack = new Error().stack?.split("\n");

    if (!stack) return "anonymous";

    for (const line of stack) {
        /* Look for: "at ClassName.methodName (...)" or "at ClassName.methodName [as alias] (...)" */
        const regex = new RegExp(`at ${className}\\.(\\w+)`);
        const match = line.trim().match(regex);
        if (match) {
            return match[1];
        }
    }

    return "anonymous";
}

function getScopeName(scopeOrInstance: string | Function | object): string {
    let scope: string;

    if (typeof scopeOrInstance === "string") {
        try {
            const stats = fs.statSync(scopeOrInstance);

            if (stats.isFile() || stats.isDirectory()) {
                scope = path.basename(scopeOrInstance);
            } else {
                scope = scopeOrInstance;
            }
        } catch {
            scope = scopeOrInstance;
        }
    } else if (typeof scopeOrInstance === "function") {
        scope = scopeOrInstance.name;
    } else if (typeof scopeOrInstance === "object") {
        const className = scopeOrInstance.constructor?.name ?? "Anonymous";
        const method = getCallerMethodName(className);

        scope = `${className}.${method}`;
    } else {
        scope = "unknown";
    }

    return scope;
}

function displayMessage(
    level: LoggerLevel,
    scopeOrInstance: string | Function | object,
    message: string,
    isExit: boolean = false,
): void {
    const timestamp = getTimestamp();
    const indentation = indentStack.map(() => "┃ ").join("");
    const isRoot = indentStack.length === 0;
    const branch = isRoot
        ? isExit
            ? "┗"
            : isEnter
              ? "┏"
              : ""
        : isExit
          ? "┗"
          : "┣";

    let msg = "";

    msg += `${timestamp} ${indentation}${branch}`;
    msg +=
        level === "ENTER" || level === "EXIT"
            ? " "
            : `${branch ? " " : ""}${styles[level].emoji}「${styles[level].message}」`;
    msg += scopeOrInstance
        ? `${ck.gray.bold(getScopeName(scopeOrInstance))} `
        : "";
    msg += `${message}`;

    console.log(msg);
}

function displayErrorMessage(error: Error): void {
    const stack = error.stack?.split("\n") ?? [];

    if (!stack) return;

    const timestamp = `${getTimestamp()}`.replace(/\x1b\[[0-9;]*m/g, "");
    const indentation = indentStack.map(() => "┃ ").join("");
    const indent = " ".repeat(timestamp.length + 1 + indentation.length);

    stack.forEach((line, index) => {
        const lineNumber = `${ck.gray(String(index + 1).padStart(2, " "))}:`;
        const isFirstLine = index === 0;
        const branch =
            isFirstLine && stack.length === 1
                ? ""
                : isFirstLine && stack.length > 1
                  ? "┏"
                  : index === stack.length - 1
                    ? "┗"
                    : "┃";
        console.log(
            `${indent}${branch} ${lineNumber} ${line.includes("at ") ? line : ck.redBright(line)}`,
        );
    });
}

export class Logger {
    public static enter(message: string): void;
    public static enter(scope: string, message: string): void;
    public static enter(scope: Function, message: string): void;
    public static enter(scope: object, message: string): void;

    public static enter(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        isEnter = true;

        displayMessage("ENTER", scope, message);

        indentStack.push("┃");
    }

    public static info(message: string): void;
    public static info(scope: string, message: string): void;
    public static info(scope: Function, message: string): void;
    public static info(scope: object, message: string): void;

    public static info(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        displayMessage("INFO", scope, message);
    }

    public static success(message: string): void;
    public static success(scope: string, message: string): void;
    public static success(scope: Function, message: string): void;
    public static success(scope: object, message: string): void;

    public static success(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        displayMessage("SUCCESS", scope, message);
    }

    public static warning(message: string): void;
    public static warning(scope: string, message: string): void;
    public static warning(scope: Function, message: string): void;
    public static warning(scope: object, message: string): void;

    public static warning(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        displayMessage("WARNING", scope, message);
    }

    public static error(error: unknown): void;
    public static error(message: string): void;
    public static error(scope: string, message: string): void;
    public static error(scope: Function, message: string): void;
    public static error(scope: object, message: string): void;
    public static error(
        scope: string | Function | object | Error,
        message: string,
        error: unknown | Error,
    ): void;

    public static error(
        scopeOrMessage: string | Function | object | Error,
        maybeMessage?: string,
        maybeError?: unknown | Error,
    ): void {
        if (maybeMessage === undefined && scopeOrMessage instanceof Error) {
            displayErrorMessage(scopeOrMessage);
            return;
        }

        const scope = maybeError
            ? (scopeOrMessage as string | Function | object)
            : maybeMessage
              ? (scopeOrMessage as string | Function | object)
              : "";

        const message = maybeError
            ? (maybeMessage ?? "")
            : (maybeMessage ?? String(scopeOrMessage));

        displayMessage("ERROR", scope, message);

        if (maybeError instanceof Error) {
            displayErrorMessage(maybeError);
        }
    }

    public static debug(message: string): void;
    public static debug(scope: string, message: string): void;
    public static debug(scope: Function, message: string): void;
    public static debug(scope: object, message: string): void;

    public static debug(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        displayMessage("DEBUG", scope, message);
    }

    public static alert(message: string): void;
    public static alert(scope: string, message: string): void;
    public static alert(scope: Function, message: string): void;
    public static alert(scope: object, message: string): void;

    public static alert(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        displayMessage("ALERT", scope, message);
    }

    public static trace(message: string): void;
    public static trace(scope: string, message: string): void;
    public static trace(scope: Function, message: string): void;
    public static trace(scope: object, message: string): void;

    public static trace(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        displayMessage("TRACE", scope, message);
    }

    public static exit(message: string): void;
    public static exit(scope: string, message: string): void;
    public static exit(scope: Function, message: string): void;
    public static exit(scope: object, message: string): void;

    public static exit(
        scopeOrMessage: string | Function | object,
        maybeMessage?: string,
    ): void {
        const scope = maybeMessage ? scopeOrMessage : "";
        const message = maybeMessage ?? String(scopeOrMessage);

        isEnter = false;
        indentStack.pop();

        displayMessage("EXIT", scope, message, true);
    }
}
