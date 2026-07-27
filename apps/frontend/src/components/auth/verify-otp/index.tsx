"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { SectionLayout } from "~/components/layouts";
import { Fade } from "~/components/motion";
import { ButtonLink, FloatingInput, Form } from "~/components/primitives";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";

import { useAuth } from "~/hooks";
import { useResendOtp } from "~/hooks/system/client";

export function VerifyOTP() {
    const router = useRouter();

    const { verifyOtp, sendOtp, loading } = useAuth();
    const { resendOtp, secondsLeft, canResend } = useResendOtp(sendOtp);

    const [code, setCode] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.replace(/\D/g, ""));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await verifyOtp({ code });

        if (!response) return;

        router.push("/portfolio");
        router.refresh();
    };

    const onResend = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        resendOtp();
    };

    return (
        <SectionLayout className="w-full max-w-lg">
            <Fade>
                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="heading-subsection text-gradient">
                            Verify your account
                        </h2>

                        <p className="text-muted-foreground mt-2 text-sm">
                            Enter the 6-digit verification code sent to your email
                        </p>
                    </div>

                    <div className="flex w-full max-w-md flex-col items-center gap-6">
                        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                            <Field>
                                <FloatingInput
                                    name="otp"
                                    label="Verification Code"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    className="h-12 text-center text-lg tracking-widest"
                                    value={code}
                                    onChange={onChange}
                                />
                            </Field>

                            <Button className="w-full cursor-pointer rounded-sm bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                                {loading ? <Spinner /> : "Verify"}
                            </Button>
                        </Form>

                        <div className="text-muted-foreground flex flex-col items-center gap-2 text-xs">
                            <span>Didn't receive the code?</span>

                            <Button
                                variant="link"
                                disabled={loading || !canResend}
                                className="cursor-pointer hover:underline"
                                onClick={onResend}
                            >
                                {secondsLeft > 0
                                    ? `Resend in ${secondsLeft}s`
                                    : "Resend Code"}
                            </Button>
                        </div>

                        <p className="text-muted-foreground text-center text-xs md:text-sm">
                            Need to cancel this verification?{" "}
                            <ButtonLink
                                href="/"
                                variant="link"
                                className="bg-transparent p-0 text-xs hover:underline"
                            >
                                Go Home
                            </ButtonLink>
                        </p>
                    </div>
                </div>
            </Fade>
        </SectionLayout>
    );
}
