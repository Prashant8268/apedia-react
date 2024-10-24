import dbConnect from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import verifyToken from "@/lib/verifyToken";
export async function GET(req) {
  try {
    await dbConnect();
    const tokenResponse = await verifyToken(req);
    if (tokenResponse) return tokenResponse;
    const userId = req.user.userId;
    const posts = await Post.find()
      .populate("user", "name avatar")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })
      .populate({
        path: "likes",
        populate: {
          path: "user", // Populate user for each like
          select: "name avatar", // Select fields to populate
        },
      });

    return NextResponse.json(
      { message: "Posts feteched successfully", posts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
