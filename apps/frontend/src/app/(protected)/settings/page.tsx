import { Suspense } from "react";

import type { Metadata } from "next";

import { Settings } from "~/components/protected";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Settings",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Settings />
        </Suspense>
    );
}
