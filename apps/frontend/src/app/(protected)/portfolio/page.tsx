import { Suspense } from "react";

import type { Metadata } from "next";

import { Portfolio } from "~/components/protected";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Portfolio",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Portfolio />
        </Suspense>
    );
}
