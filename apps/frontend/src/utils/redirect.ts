import { type NextRequest, NextResponse } from "next/server";

import type { OrcaRedirectOptions } from "~/types";

export class OrcaRedirect {
    static redirect(options: OrcaRedirectOptions): NextResponse<unknown> {
        const { to, request } = options;

        return NextResponse.redirect(new URL(to, request.nextUrl.origin));
    }

    static next(): NextResponse<unknown> {
        return NextResponse.next();
    }

    static toRoot(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: "/", request });
    }

    static toSignIn(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: "/auth/sign-in", request });
    }

    static toSignUp(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: "/auth/sign-up", request });
    }

    static toVerifyOtp(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: "/auth/verify-otp", request });
    }

    static toPortfolio(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: "/portfolio", request });
    }

    static toDashboard(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: `/admin/dashboard`, request });
    }

    static toNotFound(request: NextRequest): NextResponse<unknown> {
        return this.redirect({ to: "/404", request });
    }
}
