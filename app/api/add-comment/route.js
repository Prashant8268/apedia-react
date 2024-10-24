import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import verifyToken from "@/lib/verifyToken";

export async function POST(req, res) {
  if (req.method !== "POST") {
    // Only allow POST requests
    return NextResponse.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }
  // Verify JWT token
  const tokenResponse = await verifyToken(req);
  if (tokenResponse) return tokenResponse;

  let { text, postId } = await req.json();
  const user = req.user;
  // Extract and validate request body data

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
