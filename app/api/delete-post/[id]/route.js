import dbConnect from "@/lib/mongodb"; // Ensure you have your MongoDB connection setup
import Post from "@/models/Post"; // Adjust the path to your Post model
import User from "@/models/User"; // Adjust the path to your User model
import Comment from "@/models/Comment"; // Adjust the path to your Comment model
import Like from "@/models/Like"; // Adjust the path to your Like model
import fs from "fs/promises"; // Use promises version of fs
import path from "path";
import { NextResponse } from "next/server";
import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/lib/s3";
import verifyToken from "@/lib/verifyToken";
// Define the path to the uploads directory
const AVATAR_PATH = path.join(process.cwd(), "tem_store/uploads/posts");

export async function GET(req, { params }) {
  const { id } = params;
  const tokenResponse = await verifyToken(req);
  if (tokenResponse) return tokenResponse;
  const user = req.user;

  await dbConnect();

  try {
    // Find the post by ID and populate comments and likes
    const post = await Post.findById(id).populate("comments likes");
    if (post.user != user.userId)
      return NextResponse.json(
        { message: "Not authorized to Delete Post" },
        { status: 403 }
      );
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Remove the photo from S3 if it exists
    if (post.photoUrl) {
      const photoKey = post.photoUrl.split("/").pop(); // Get the key from the URL

      console.log("Attempting to delete photo from S3:", photoKey);
      console.log(photoKey, "key");
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/posts/${photoKey}`,
      });

      try {
        await s3Client.send(deleteCommand);
        console.log("Successfully deleted from S3");
      } catch (deleteError) {
        console.error("Error deleting from S3:", deleteError);
      }
    }

    // Remove all associated comments and likes
    await Comment.deleteMany({ _id: { $in: post.comments } });
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
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}
