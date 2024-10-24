// lib/auth.js
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export default async function  verifyToken(req) {
  // const authHeader = req.headers.get("Authorization");
  // if (!authHeader) {
  //   return NextResponse.json(
  //     { message: "Authorization token required" },
  //     { status: 401 }
  //   );
  // }

  // const token = authHeader.split(" ")[1];
  // console.log(token, 'token');
  const token = req.cookies.get("token");
  try {
    const user = jwt.verify(token.value, process.env.JWT_SECRET);
    req.user = user;
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}
