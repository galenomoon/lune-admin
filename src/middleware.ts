import { NextRequest, NextResponse } from "next/server";

enum RoutesEnum {
  AUTH_LOGIN = "/login",
  SUBSCRIPTION = "/assinar-matricula",
  DASHBOARD = "/",
}

export default function AuthMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const redirectPath = request.nextUrl.searchParams.get("redirect");

 const isSubscriptionRoute = pathname.includes(RoutesEnum.SUBSCRIPTION);
  // Se não tem token e não está na página de login, redireciona para login
  if (!token && pathname !== RoutesEnum.AUTH_LOGIN && !isSubscriptionRoute) {
    const loginUrl = new URL(RoutesEnum.AUTH_LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tem token e está na página de login, redireciona para dashboard ou página original
  if (token && pathname === RoutesEnum.AUTH_LOGIN) {
    const targetUrl = redirectPath ? new URL(redirectPath, request.url) : new URL(RoutesEnum.DASHBOARD, request.url);
    targetUrl.searchParams.delete("redirect");
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

