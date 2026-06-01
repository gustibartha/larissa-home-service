import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedPrefixes = [
  "/dashboard",
  "/katalog",
  "/pesan",
  "/pembayaran",
  "/pesanan",
  "/hasil",
  "/profil",
  "/notifikasi",
  "/admin",
];

const authPages = ["/masuk", "/daftar"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(getSessionCookie(req));

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthPage = authPages.includes(pathname);

  if (isProtected && !hasSession) {
    const url = new URL("/masuk", req.nextUrl);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
