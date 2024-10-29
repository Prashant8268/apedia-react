// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();

  try {
    // Verify token if it exists
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
      // return NextResponse.next();
    }
  } catch (error) {
    // Handle invalid token: delete it and proceed with redirection
    req.cookies.delete("token");
    // return NextResponse.redirect(new URL("/signIn", req.url));
  }

  // Redirect authenticated users away from sign-in, sign-up, and root page to /posts
  if (
    url.pathname === "/signIn" ||
    url.pathname === "/signUp" ||
    url.pathname === "/"
  ) {
    if (token) {
      console.log("User is already authenticated, redirecting to /posts");
      return NextResponse.redirect(new URL("/posts", req.url));
    }
  } else if (
    url.pathname.startsWith("/posts") ||
    url.pathname === "/profile" ||
    url.pathname === "/chat"
  ) {
    if (!token) {
      console.log("User is not authenticated, redirecting to /signIn");
      return NextResponse.redirect(new URL("/signIn", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signIn", "/signUp", "/", "/posts/:path*", "/profile", "/chat"],
};
