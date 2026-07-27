"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { SectionLayout } from "~/components/layouts";
import { Fade } from "~/components/motion";
import { ButtonLink, FloatingInput, Form } from "~/components/primitives";
import { Button } from "~/components/ui/button";
import { Field, FieldDescription } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";

import { useAuth } from "~/hooks";
import { useResponsive } from "~/hooks/system/client";

import { cn } from "~/lib/utils";

import type { SignUpForm } from "@orca-wallet/shared";

const passwordRequirements = [
    {
        key: "length",
        label: "At least 8 characters",
        test: (password: string) => password.length >= 8,
    },
    {
        key: "uppercase",
        label: "At least one uppercase letter",
        test: (password: string) => /[A-Z]/.test(password),
    },
    {
        key: "lowercase",
        label: "At least one lowercase letter",
        test: (password: string) => /[a-z]/.test(password),
    },
    {
        key: "number",
        label: "At least one number",
        test: (password: string) => /[0-9]/.test(password),
    },
    {
        key: "specialChar",
        label: "At least one special character",
        test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
];

export function SignUp() {
    const router = useRouter();

    const { signUp, loading } = useAuth();
    const { isDesktop } = useResponsive();

    const [form, setForm] = useState<SignUpForm>({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (await signUp(form)) {
            router.push("/auth/verify-otp");
            router.refresh();
        }
    };

    return (
        <SectionLayout className="w-full max-w-lg">
            <Fade>
                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="heading-subsection text-gradient">
                            Create your account
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Join Orca Wallet and start managing your assets
                        </p>
                    </div>

                    <div className="flex w-full max-w-md flex-col items-center gap-6">
                        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
                            <Field>
                                <FloatingInput
                                    name="username"
                                    label="Username"
                                    type="text"
                                    className="h-12"
                                    value={form.username}
                                    onChange={onChange}
                                />
                                <FieldDescription className="text-[11px]">
                                    This will be your public username and can be used
                                    to sign in.
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FloatingInput
                                    name="email"
                                    label="Email address"
                                    type="email"
                                    className="h-12"
                                    value={form.email}
                                    onChange={onChange}
                                />
                                <FieldDescription className="text-[11px]">
                                    We&apos;ll use this to contact you. We will not
                                    share your email with anyone else.
                                </FieldDescription>
                            </Field>

                            <div className="flex gap-6">
                                <Field>
                                    <FloatingInput
                                        name="password"
                                        label="Password"
                                        type="password"
                                        className="h-12"
                                        value={form.password}
                                        onChange={onChange}
                                    />
                                </Field>

                                <Field>
                                    <FloatingInput
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        className="h-12"
                                        value={form.confirmPassword}
                                        onChange={onChange}
                                    />
                                </Field>
                            </div>

                            <Field>
                                <FieldDescription>
                                    {passwordRequirements.map((req) => {
                                        const passed = req.test(form.password);

                                        return (
                                            <span
                                                key={req.key}
                                                className={cn(
                                                    "flex items-center gap-2 text-[11px]",
                                                    passed
                                                        ? "text-green-600"
                                                        : "text-muted-foreground",
                                                )}
                                            >
                                                <span>{passed ? "✓" : "•"}</span>
                                                <span>{req.label}</span>
                                            </span>
                                        );
                                    })}
                                </FieldDescription>
                            </Field>

                            <Button className="w-full cursor-pointer rounded-sm bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                                {loading ? <Spinner /> : "Sign Up"}
                            </Button>
                        </Form>

                        <p className="text-muted-foreground text-center text-xs text-nowrap">
                            Already have an account?{" "}
                            <ButtonLink
                                href="/auth/sign-in"
                                variant="link"
                                className="bg-transparent p-0 text-xs hover:underline"
                                useNextLink={true}
                            >
                                Sign In
                            </ButtonLink>
                        </p>
                    </div>
                </div>
            </Fade>
        </SectionLayout>
    );
}
