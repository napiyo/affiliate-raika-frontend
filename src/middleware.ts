// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./lib/apiService";
import { Role_ENUM, User } from "./types/user";

interface JwtPayload {
  id: string;
  role: string;
}

// Environment variables for configuration
const PUBLIC_PATHS = ["/auth", "/public","shoot"];
const ADMIN_PATHS = ["admin"];
const DASHBOARD_PATH = "/dashboard";
const LOGIN_PATH = "/auth";
const FORBIDDEN_PATH = "/403";
// const API_BASE = process.env.BACKEND_API_URL;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const jwt = req.cookies.get("jwt")?.value;
  
  const isPublicPath = (path: string) => PUBLIC_PATHS.some((p) => path.startsWith(p));
  const isAdminPath = (path: string) => ADMIN_PATHS.some((p) => path.includes(p));
  
  // Handle already authenticated users attempting to access public paths
  if (jwt && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  // Handle unauthorized users trying to access protected paths
  if (!jwt && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  // Handle authenticated users on the root path
  if (jwt && pathname === "/") {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
  }

  // Handle admin-only routes for authenticated users
  if (jwt && isAdminPath(pathname)) {
    try {
      const payload: User = await verifyJwtWithBackend(jwt);
      if (payload.role !== Role_ENUM.ADMIN && payload.role !== Role_ENUM.SALES) {
        return NextResponse.redirect(new URL(FORBIDDEN_PATH, req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
  }

  return NextResponse.next();
}

async function verifyJwtWithBackend(jwt: string): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE}/auth/me`, {
    method: "GET",
    headers: {
      // Send only the jwt cookie to backend
      cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error("Invalid JWT");
  }
  
  const data = await res.json();
  return data.data as User;
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.css|.*\\.js|.*\\.map).*)',
  ],
};
