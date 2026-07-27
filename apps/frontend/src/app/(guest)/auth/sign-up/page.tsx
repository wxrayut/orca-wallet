import { Suspense } from "react";

import type { Metadata } from "next";

import { SignUp } from "~/components/auth";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Sign Up",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <SignUp />
        </Suspense>
    );
}
