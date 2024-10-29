import { NextResponse } from "next/server";
import fs from "fs/promises"; // Use promises version of fs
import path from "path";
import jwt from "jsonwebtoken";
import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import s3Client from "@/lib/s3";
// Path to save uploaded photos
const AVATAR_PATH = path.join("tem_store/uploads/posts");

export async function POST(req) {
  // Connect to the database
  await dbConnect();

  // Validate Authorization header
  const token = req.cookies.get("token");
  const decode = jwt.verify(token.value, process.env.JWT_SECRET);
  const userId = decode.userId;
  let user;

  try {
    user = jwt.verify(token.value, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Use FormData to get fields and files
  const data = await req.formData();
  const content = data.get("content"); // Get text field
  const photo = data.get("photo"); // Get the photo file

  // Prepare post details
  const postDetails = {
    user: user.userId,
    content: content,
    timestamp: Date.now(),
  };

  if (photo) {
    const photoUrl = await uploadToS3(photo);
    postDetails.photoUrl = photoUrl;
  }

  try {
    const new_post = await Post.create(postDetails);
    await new_post.populate("user", "name email avatarUrl");
    const user_later = await User.findByIdAndUpdate(
      user.userId,
      { $push: { posts: new_post._id } },
      { new: true }
    );

    return NextResponse.json({
      message: "Post created successfully",
      newPost: new_post,
    });
  } catch (err) {
    console.error("Error processing the request:", err);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}

// Function to upload the photo to S3
// Function to upload the photo to S3
import { PutObjectCommand } from "@aws-sdk/client-s3";
import Email from "next-auth/providers/email";
// import s3Client from "@/lib/s3Client";

// Function to upload the photo to S3
async function uploadToS3(photo) {
  const sanitizedPhotoName = photo.name.replace(/\s+/g, "_");
  const photoName = `${Date.now()}_${sanitizedPhotoName}`;

  // Convert the photo to a buffer
  const buffer = Buffer.from(await photo.arrayBuffer());

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/posts/${photoName}`,
    Body: buffer,
    ContentType: photo.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/uploads/posts/${photoName}`; // Construct the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload to S3");
  }
}
