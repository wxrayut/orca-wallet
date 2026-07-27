"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { SectionLayout } from "~/components/layouts";
import { Fade } from "~/components/motion";
import { ButtonLink, FloatingInput, Form } from "~/components/primitives";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";

import { useAuth } from "~/hooks";

import { Role, type SignInForm } from "@orca-wallet/shared";

export function SignIn() {
    const router = useRouter();

    const { signIn, loading } = useAuth();

    const [form, setForm] = useState<SignInForm>({
        emailOrusername: "",
        password: "",
        rememberMe: false,
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onChangeCheckbox = (checked: boolean) => {
        setForm({ ...form, rememberMe: checked });
    };

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const response = await signIn(form);

        if (!response) return;

        router.push(
            response?.role === Role.ADMIN ? "/admin/dashboard" : "/auth/verify-otp",
        );
        router.refresh();
    };

    return (
        <SectionLayout className="w-full max-w-lg">
            <Fade>
                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="heading-subsection text-gradient">
                            Nice to have you back!
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="flex w-full max-w-md flex-col items-center gap-6">
                        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                            <Field>
                                <FloatingInput
                                    name="emailOrusername"
                                    label="Email or Username"
                                    type="text"
                                    className="h-12"
                                    value={form.emailOrusername}
                                    onChange={onChange}
                                />
                            </Field>

                            <Field>
                                <FloatingInput
                                    name="password"
                                    label="Password"
                                    type="password"
                                    className="h-12"
                                    value={form.password}
                                    onChange={onChange}
                                />

                                <div className="flex w-full items-center justify-end">
                                    <ButtonLink
                                        href="/auth/forgot-password"
                                        variant="link"
                                        className="text-muted-foreground text-xs font-light"
                                    >
                                        Forgot your password?
                                    </ButtonLink>
                                </div>
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    name="rememberMeCheckbox"
                                    defaultChecked={form.rememberMe}
                                    onCheckedChange={onChangeCheckbox}
                                    className="cursor-pointer rounded-sm"
                                />

                                <FieldContent>
                                    <FieldLabel
                                        htmlFor="rememberMeCheckbox"
                                        className="text-xs"
                                    >
                                        Remember me
                                    </FieldLabel>

                                    <FieldDescription className="text-xs">
                                        Keep me logged in on this device
                                    </FieldDescription>
                                </FieldContent>
                            </Field>

                            <Button
                                className="w-full cursor-pointer rounded-sm bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Sign In"}
                            </Button>
                        </Form>

                        <p className="text-muted-foreground text-center text-xs text-nowrap">
                            Don't have an account?{" "}
                            <ButtonLink
                                href="/auth/sign-up"
                                variant="link"
                                className="bg-transparent p-0 text-xs hover:underline"
                                useNextLink={true}
                            >
                                Sign Up
                            </ButtonLink>
                        </p>
                    </div>
                </div>
            </Fade>
        </SectionLayout>
    );
}
