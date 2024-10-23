import dbConnect from "@/lib/mongodb"; // Ensure you have your MongoDB connection setup
import Post from "@/models/Post"; // Adjust the path to your Post model
import User from "@/models/User"; // Adjust the path to your User model
import Comment from "@/models/Comment"; // Adjust the path to your Comment model
import Like from "@/models/Like"; // Adjust the path to your Like model
import fs from "fs/promises"; // Use promises version of fs
import path from "path";
import { NextResponse } from "next/server";

// Define the path to the uploads directory
const AVATAR_PATH = path.join(process.cwd(), "public/uploads/posts");

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req, { params }) {
  const { id } = params;

  await dbConnect();

  try {
    // Find the post by ID and delete it
    const post = await Post.findById(id).populate("comments likes"); // Populate comments and likes
    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
      });
    }

    // Remove the photo from the file system
    if (post.photoUrl) {
      const photoPath = path.join(AVATAR_PATH, post.photoUrl.split("/").pop());
      await fs.unlink(photoPath); // Delete the photo file
    }

    // Remove all associated comments
    await Comment.deleteMany({ _id: { $in: post.comments } });

    // Remove all likes
    await Like.deleteMany({ _id: { $in: post.likes } });

    // Remove the post ID from the user's posts array
    await User.findByIdAndUpdate(
      post.user, // Assuming post has the user ID
      { $pull: { posts: post._id } }, // Remove the post ID from the user's posts array
      { new: true }
    );

    // Delete the post itself
    await Post.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Post Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({ message: "Failed to delete post" }), {
      status: 500,
    });
  }
}
