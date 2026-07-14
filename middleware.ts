import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROUTES } from "@/constants/routes";

const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD];

export async function middleware(request: NextRequest) {
    // Let API routes handle their own auth; don't redirect them to a page.
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const { response } = await updateSession(request);
        return response;
    }

    const { response, user } = await updateSession(request);

    const isPublicRoute = PUBLIC_ROUTES.includes(
        request.nextUrl.pathname as (typeof PUBLIC_ROUTES)[number]
    );

    if (!user && !isPublicRoute) {
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (user && request.nextUrl.pathname === ROUTES.LOGIN) {
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};