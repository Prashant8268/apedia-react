import dbConnect from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Email from "next-auth/providers/email";
import Friendship from "@/models/Friendship";
export async function GET(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token");
    let userId;
    try {
      const decode = jwt.verify(token.value, process.env.JWT_SECRET);
      userId = decode.userId;
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let user = await User.findById(userId).populate('friends');
    const userData = {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      id: user._id,
      friends: user.friends,
      friendsName: user.friendsName,
    };
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
