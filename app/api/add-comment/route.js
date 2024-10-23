import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, res) {
  if (req.method !== "POST") {
    // Only allow POST requests
    return NextResponse.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }
  // Verify JWT token
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user.userId || !mongoose.Types.ObjectId.isValid(user.userId)) {
      throw new Error("Invalid user ID");
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Extract and validate request body data
  const { text, postId, token } = await req.json();
  if (!text || typeof text !== "string" || text.trim() === "") {
    return NextResponse.json(
      { success: false, error: "Invalid or missing 'text'" },
      { status: 400 }
    );
  }
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing 'postId'" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnect();

    // Find the related post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Create and populate the new comment
    const newComment = await Comment.create({
      content: text,
      user: user.userId,
      post: postId,
    });
    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "name"
    );

    // Add the comment to the post and save
    post.comments.push(newComment._id);
    await post.save();

    return NextResponse.json(
      { success: true, comment: populatedComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
