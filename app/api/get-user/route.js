import dbConnect from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Email from "next-auth/providers/email";
import Friendship from "@/models/Friendship";
import { Cuprum } from "next/font/google";
export async function GET(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token");
    let userId;
    try {
      const decode = jwt.verify(token.value, process.env.JWT_SECRET);
      userId = decode.userId;
    } catch (err) {
      const response = NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );

      // Set the token cookie to an empty string with a past expiration date
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: -1,
        path: "/",
      });

      return response;
    }
    let user = await User.findById(userId)
      .populate({
        path: "friends",
        populate: {
          path: "from_user",
          select: "name avatarUrl",
        },
      })
      .populate("friendsName", "name avatarUrl");
    const friendRequest =
      user?.friends?.filter((friend) => friend.to_user == userId) || [];
    const userData = {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      id: user._id,
      friends: user.friends,
      friendsName: user.friendsName,
      friendRequest,
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
