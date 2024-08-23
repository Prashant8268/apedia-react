import dbConnect from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Email from "next-auth/providers/email";

export async function GET(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token");
    const decode = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decode.userId;
    let user = await User.findById(userId);
    const userData = {
      name : user.name,
      email:user.email
    }
    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
