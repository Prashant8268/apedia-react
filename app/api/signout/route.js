// pages/api/logout.js

import { NextResponse } from "next/server";
import cookie from "cookie";

export async function GET(req) {
  // Retrieve the token from cookies
  const token = req.cookies.get("token");

  // If token is present, clear the cookie
  if (token) {
    // Create a new response with a cleared cookie
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Set the token cookie to an empty string with a past expiration date
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: -1,
      path: "/",
    });

    return response;
  }

  // If no token is present, return a 400 Bad Request response
  return NextResponse.json({ error: "No token to clear" }, { status: 400 });
}
