"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { endpoints } from "~/endpoint";

import {
    AuthContextState,
    OrcaFetcher,
    Role,
    type SignInForm,
    type SignInResponse,
    type SignUpForm,
    type SignUpResponse,
    type UserResponse,
    type VerifyOTPForm,
} from "@orca-wallet/shared";

type AuthContextType = {
    user: UserResponse | null;
    initializing: boolean;
    loading: boolean;
    state: AuthContextState;
    successMessage: string;
    errorMessage: string;
    isAuthenticated: boolean;
    signIn(data: SignInForm): Promise<SignInResponse | null>;
    signUp(data: SignUpForm): Promise<SignUpResponse | null>;
    sendOtp(): Promise<boolean>;
    verifyOtp(data: VerifyOTPForm): Promise<boolean>;
    me(): Promise<boolean>;
    signOut(): Promise<boolean>;
};

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(AuthContextState.UNAUTHORIZED);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const setError = (error: unknown) => {
        setSuccessMessage("");
        setErrorMessage(error instanceof Error ? error.message : String(error));
    };

    const setAuthorized = (user: UserResponse) => {
        setUser(user);
        setState(AuthContextState.AUTHORIZED);
    };

    const setUnauthorized = () => {
        setUser(null);
        setState(AuthContextState.UNAUTHORIZED);
    };

    const setMessage = (response: { success: boolean; message: string }) => {
        if (response.success) {
            setSuccessMessage(response.message);
        } else {
            setErrorMessage(response.message);
        }
    };

    const signIn = useCallback(async (data: SignInForm) => {
        clearMessages();
        setLoading(true);

        try {
            const response = await OrcaFetcher.post<SignInResponse>(
                endpoints.auth.signIn("v1"),
                data,
            );

            /** If sign-in is successful and the user is an admin, we set the
                state to 'AUTHORIZED' immediately. This is because admins don't
                need to go through OTP verification. */
            if (response.success && response.data?.role === Role.ADMIN) {
                setState(AuthContextState.AUTHORIZED);
                await me();
            }

            setMessage(response);
            return response.data ?? null;
        } catch (error) {
            setError(error);
            setUnauthorized();
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (data: SignUpForm) => {
        clearMessages();
        setLoading(true);

        try {
            const response = await OrcaFetcher.post<SignUpResponse>(
                endpoints.auth.signUp("v1"),
                data,
            );

            setMessage(response);
            return response.data ?? null;
        } catch (error) {
            setError(error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendOtp = useCallback(async () => {
        clearMessages();
        setLoading(true);

        try {
            const response = await OrcaFetcher.post(endpoints.auth.sendOtp("v1"));

            setMessage(response);
            return response.success;
        } catch (error) {
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyOtp = useCallback(async (data: VerifyOTPForm) => {
        clearMessages();
        setLoading(true);

        try {
            const response = await OrcaFetcher.post(
                endpoints.auth.verifyOtp("v1"),
                data,
            );

            if (response.success) {
                await me();
            }

            setMessage(response);
            return response.success;
        } catch (error) {
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const me = useCallback(async () => {
        try {
            const response = await OrcaFetcher.get<UserResponse>(
                endpoints.auth.me("v1"),
            );

            if (response.success && response.data) {
                setAuthorized(response.data);
                return true;
            }

            setUnauthorized();
            return false;
        } catch {
            setUnauthorized();
            return false;
        }
    }, []);

    const signOut = useCallback(async () => {
        clearMessages();
        setLoading(true);

        try {
            const response = await OrcaFetcher.post(endpoints.auth.signOut("v1"));

            if (response.success) {
                setUnauthorized();
                setMessage(response);
                return true;
            }

            return false;
        } catch (error) {
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const isAuthenticated = useMemo(() => {
        return !!user && state === AuthContextState.AUTHORIZED;
    }, [user, state]);

    useEffect(() => {
        (async () => {
            try {
                // Simulate loading delay for development/testing purposes
                // await new Promise((resolve) => setTimeout(resolve, 1000000));
                await me();
            } catch (error) {
                setError(error);
                setUnauthorized();
            } finally {
                setInitializing(false);
            }
        })();
    }, [me]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, {
                duration: 2000,
                position: "top-center",
            });
        }
        if (errorMessage) {
            toast.error(errorMessage, {
                duration: 2000,
                position: "top-center",
            });
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthContext.Provider
            value={{
                user,
                initializing,
                loading,
                state,
                successMessage,
                errorMessage,
                isAuthenticated,
                signIn,
                signUp,
                sendOtp,
                verifyOtp,
                me,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
