import { Suspense } from "react";

import type { Metadata } from "next";

import { Users } from "~/components/protected/admin";
import { Loading } from "~/components/system";

export const metadata: Metadata = {
    title: "Users",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Users />
        </Suspense>
    );
}
