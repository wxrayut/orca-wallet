import { Suspense } from "react";

import type { Metadata } from "next";

import { Dashboard } from "~/components/protected/admin";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Dashboard />
        </Suspense>
    );
}
