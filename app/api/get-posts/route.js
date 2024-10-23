import dbConnect from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
export async function GET(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token");
    const decode = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decode.userId;
    const posts = await Post.find({ user: userId })
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
