import { type NextRequest, NextResponse } from "next/server";

/* import { useWhoAmI } from "./hooks/system/server"; */

export default async function proxy(request: NextRequest) {
    const headers = new Headers(request.headers);

    headers.set("x-current-path", request.nextUrl.pathname);
    headers.set("x-current-search", request.nextUrl.search);

    return NextResponse.next({ headers });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)"],
};
