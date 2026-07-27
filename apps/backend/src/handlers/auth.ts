import type { User } from "@prisma/client";
import type { Response } from "express";

import {
    AUTH_COOKIE_LIFE_TIME,
    AUTH_COOKIE_NAME,
    AuthContextState,
    Purpose,
    type WhoAmI,
} from "@orca-wallet/shared";

import { appConfig } from "../config";
import { OrcaJWT } from "../core";
import { UserService } from "../services";
import { UserCache } from "../services/user/cache";
import type { CookieOptions } from "../types";
import { OrcaOTP, OrcaResponse } from "../utils";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: appConfig.isProduction,
    sameSite: "lax",
    path: "/",
};

export function handleAdminSignIn(
    res: Response,
    user: User,
    rememberMe: boolean = false,
) {
    const signed = OrcaJWT.fastSign(
        {
            state: AuthContextState.AUTHORIZED,
            email: user.email,
            role: user.role,
        },
        {
            expiresIn: rememberMe
                ? AUTH_COOKIE_LIFE_TIME.JWT.ACCESS_30D
                : AUTH_COOKIE_LIFE_TIME.JWT.ACCESS_7D,
        },
    );

    return OrcaResponse.Ok(res, {
        message: `Welcome back, ${user.username}!`,
        data: {
            role: user.role,
        },
    })
        .cookie(AUTH_COOKIE_NAME, signed, {
            ...cookieOptions,
            maxAge: rememberMe
                ? AUTH_COOKIE_LIFE_TIME.MS.D30
                : AUTH_COOKIE_LIFE_TIME.MS.D7,
        })
        .send();
}

export async function handleUserSignIn(
    res: Response,
    user: User,
    rememberMe: boolean = false,
) {
    const signed = OrcaJWT.fastSign(
        {
            state: AuthContextState.VERIFY_OTP,
            email: user.email,
            role: user.role,
            rememberMe: rememberMe,
            purpose: Purpose.LOGIN,
        },
        {
            expiresIn: AUTH_COOKIE_LIFE_TIME.JWT.OTP,
        },
    );

    await OrcaOTP.assign(user.email, Purpose.LOGIN);

    return OrcaResponse.Ok(res, {
        message: `Welcome back, ${user.username}! Please verify the OTP sent to your email.`,
        data: {
            role: user.role,
        },
    })
        .cookie(AUTH_COOKIE_NAME, signed, {
            ...cookieOptions,
            maxAge: AUTH_COOKIE_LIFE_TIME.MS.OTP,
        })
        .send();
}

export async function handleUserSignUp(
    res: Response,
    user: User,
    rememberMe: boolean = false,
) {
    const signed = OrcaJWT.fastSign(
        {
            state: AuthContextState.VERIFY_OTP,
            email: user.email,
            role: user.role,
            purpose: Purpose.REGISTER,
        },
        {
            expiresIn: AUTH_COOKIE_LIFE_TIME.JWT.OTP,
        },
    );

    await OrcaOTP.assign(user.email, Purpose.REGISTER);

    return OrcaResponse.Ok(res, {
        message: `Welcome, ${user.username}! Please verify the OTP sent to your email to complete your registration.`,
        data: {
            role: user.role,
        },
    })
        .cookie(AUTH_COOKIE_NAME, signed, {
            ...cookieOptions,
            maxAge: AUTH_COOKIE_LIFE_TIME.MS.OTP,
        })
        .send();
}

export async function handleSendOtp(response: Response, whoami: WhoAmI) {
    await OrcaOTP.assign(whoami.email, whoami.purpose);

    return OrcaResponse.Ok(response, {
        message: "OTP has been sent to your email. Please check your inbox.",
    }).send();
}

export async function handleVerifyOtp(
    response: Response,
    whoami: WhoAmI,
    code: string,
) {
    const verified = await OrcaOTP.verify(whoami.email, whoami.purpose, code);

    if (!verified) {
        return OrcaResponse.Unauthorized(
            response,
            "Failed to verify OTP. Please check the code and try again.",
        );
    }

    const isLogin = whoami.purpose === Purpose.LOGIN;

    const expiresIn =
        isLogin && whoami.rememberMe
            ? AUTH_COOKIE_LIFE_TIME.JWT.ACCESS_30D
            : AUTH_COOKIE_LIFE_TIME.JWT.ACCESS_7D;
    const maxAge =
        isLogin && whoami.rememberMe
            ? AUTH_COOKIE_LIFE_TIME.MS.D30
            : AUTH_COOKIE_LIFE_TIME.MS.D7;

    const signed = OrcaJWT.fastSign(
        {
            state: AuthContextState.AUTHORIZED,
            email: whoami.email,
            role: whoami.role,
        },
        {
            expiresIn,
        },
    );

    await UserService.updateByEmail(whoami.email, {
        isActive: true,
        isVerified: true,
        lastLogin: new Date(),
    });

    return OrcaResponse.Ok(response, {
        message: "OTP verified successfully. You are now signed in.",
    })
        .cookie(AUTH_COOKIE_NAME, signed, {
            ...cookieOptions,
            maxAge,
        })
        .send();
}

export async function handleWhoAmI(response: Response, whoami: WhoAmI) {
    return OrcaResponse.Success(response, {
        message: "Checked user information successfully",
        data: whoami,
    });
}

export async function handleMe(response: Response, whoami: WhoAmI) {
    const user = await UserService.getByIdentifier(whoami.email);

    if (!user) {
        return OrcaResponse.NotFound(response, "User not found");
    }

    const { password, ...safeUser } = user;

    return OrcaResponse.Success(response, {
        message: "User information fetched successfully",
        data: safeUser,
    });
}

export async function handleSignOut(response: Response, whoami: WhoAmI) {
    await UserService.updateByEmail(whoami.email, {
        isActive: false,
    });

    const user = await UserService.getByIdentifier(whoami.email);

    if (!user) {
        return OrcaResponse.NotFound(response, "User not found.");
    }

    await UserCache.invalidate(user.id);
    await UserCache.invalidate(user.username);
    await UserCache.invalidate(user.email);

    return OrcaResponse.Ok(response, {
        message: "You have been signed out successfully.",
    })
        .clear(AUTH_COOKIE_NAME)
        .send();
}
