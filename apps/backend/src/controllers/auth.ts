import { Role } from "@prisma/client";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import type { SignInForm, SignUpForm, VerifyOTPForm } from "@orca-wallet/shared";

import { OrcaBcrypt } from "../core";
import {
    handleAdminSignIn,
    handleMe,
    handleSendOtp,
    handleSignOut,
    handleUserSignIn,
    handleUserSignUp,
    handleVerifyOtp,
    handleWhoAmI,
} from "../handlers";
import { getUserRequest } from "../http";
import { UserService } from "../services";
import { Logger, OrcaParser, OrcaResponse } from "../utils";

export class AuthController {
    public static signIn: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<SignInForm>(request);

            if (!form.emailOrusername) {
                return OrcaResponse.BadRequest(
                    response,
                    "Email or username is required",
                );
            }

            if (!form.password) {
                return OrcaResponse.BadRequest(response, "Password is required");
            }

            const user = await UserService.getByIdentifier(form.emailOrusername);

            if (!user) {
                return OrcaResponse.NotFound(response, "User not found");
            }

            if (user.isActive) {
                return OrcaResponse.Unauthorized(
                    response,
                    "Your account is already signed in on another device. Please sign out from other devices first.",
                );
            }

            const passwordMatch = await OrcaBcrypt.compare(
                form.password,
                user.password,
            );

            if (!passwordMatch) {
                return OrcaResponse.Unauthorized(response, "Password is incorrect");
            }

            switch (user.role) {
                case Role.USER:
                    return handleUserSignIn(response, user, form.rememberMe);
                case Role.ADMIN:
                    return handleAdminSignIn(response, user, form.rememberMe);
                default:
                    return OrcaResponse.Unauthorized(
                        response,
                        "Your account role is not authorized to sign in",
                    );
            }
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while signing in",
            );
        }
    };

    public static signUp: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<SignUpForm>(request);

            if (!form.email) {
                return OrcaResponse.BadRequest(response, "Email is required");
            }

            if (!form.username) {
                return OrcaResponse.BadRequest(response, "Username is required");
            }

            if (!form.password) {
                return OrcaResponse.BadRequest(response, "Password is required");
            }

            if (form.password !== form.confirmPassword) {
                return OrcaResponse.BadRequest(
                    response,
                    "Password and confirm password do not match",
                );
            }

            const [existingByEmail, existingByUsername] = await Promise.all([
                UserService.getByIdentifier(form.email),
                UserService.getByIdentifier(form.username),
            ]);

            if (existingByEmail) {
                return OrcaResponse.Conflict(
                    response,
                    "Email is already registered. Please use a different email.",
                );
            }

            if (existingByUsername) {
                return OrcaResponse.Conflict(
                    response,
                    "Username is already taken. Please choose a different username.",
                );
            }

            const passwordHash = await OrcaBcrypt.hash(form.password);
            const user = await UserService.create({
                email: form.email,
                username: form.username,
                password: passwordHash,
                avatar: null,
                role: Role.USER,
                isVerified: false,
                isActive: false,
                lastLogin: null,
            });

            return handleUserSignUp(response, user);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while signing up",
            );
        }
    };

    public static sendOtp: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);

            return handleSendOtp(response, whoami);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while sending OTP",
            );
        }
    };

    public static verifyOtp: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);
            const form = OrcaParser.parse<VerifyOTPForm>(request);

            if (!form.code) {
                return OrcaResponse.BadRequest(response, "OTP code is required");
            }

            return handleVerifyOtp(response, whoami, form.code);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while verifying OTP",
            );
        }
    };

    public static whoami: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);

            return handleWhoAmI(response, whoami);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while checking user information",
            );
        }
    };

    public static me: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);

            return handleMe(response, whoami);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching user information",
            );
        }
    };

    public static signOut: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);

            return handleSignOut(response, whoami);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while signing out",
            );
        }
    };
}
