import { Suspense } from "react";

import type { Metadata } from "next";

import { VerifyOTP } from "~/components/auth";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Verify OTP",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <VerifyOTP />
        </Suspense>
    );
}
