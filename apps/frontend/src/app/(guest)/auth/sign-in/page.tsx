import { Suspense } from "react";

import type { Metadata } from "next";

import { SignIn } from "~/components/auth";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Sign In",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <SignIn />
        </Suspense>
    );
}
