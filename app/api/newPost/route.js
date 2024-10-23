import { NextResponse } from "next/server";
import fs from "fs/promises"; // Use promises version of fs
import path from "path";
import jwt from "jsonwebtoken";
import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

// Path to save uploaded photos
const AVATAR_PATH = path.join("public/uploads/posts");

export async function POST(req) {
  // Connect to the database
  await dbConnect();

  // Validate Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
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
    const photoUrl = await savePhoto(photo);
    postDetails.photoUrl = photoUrl;
  }

  try {
    const new_post = await Post.create(postDetails);
    await User.findByIdAndUpdate(
      user.userId,
      { $push: { posts: new_post._id } },
      { new: true }
    );

    return NextResponse.json({
      message: "Post created successfully",
    });
  } catch (err) {
    console.error("Error processing the request:", err);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}

// Function to save the photo to the server
async function savePhoto(photo) {
  const sanitizedPhotoName = photo.name.replace(/\s+/g, "_");
  const photoName = `${Date.now()}_${sanitizedPhotoName}`;
  const photoPath = path.join(process.cwd(), AVATAR_PATH, photoName);

  const buffer = Buffer.from(await photo.arrayBuffer());

  await fs.writeFile(photoPath, buffer);
  // console.log("Photo saved successfully:", photoPath);

  return `/uploads/posts/${photoName}`;
}
