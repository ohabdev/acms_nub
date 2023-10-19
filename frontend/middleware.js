import { NextResponse } from "next/server";

const publicRoutes = [
  "login",
  "registration",
  "verify-account",
  "forgot-password",
  "reset-password",
];
const privateRoutes = ["", "user"];

export function middleware(request) {
  let accessToken = request.cookies.get("user_access_token")?.value;
  const path = request.nextUrl.pathname;
  const firstRoutePath = path.substring(1).split("/")[0];

  if (!accessToken && privateRoutes.includes(firstRoutePath)) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (accessToken && publicRoutes.includes(firstRoutePath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/registration/:path*",
    "/verify-account/:path*",
    "/forgot-password",
    "/reset-password/:path*",
    "/user/:path*",
  ],
};
