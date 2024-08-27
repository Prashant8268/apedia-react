import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import multer from "multer";
import { promisify } from "util";
import { Formidable } from "formidable";

// Set up Multer for handling file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save uploads to the "uploads" directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });
// const uploadMiddleware = promisify(upload.single("photo"));

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }

  await dbConnect();
  console.log( await req.body,req.file,'data')
  let data = await req.json();

  try {
    // Handle file upload
    // await uploadMiddleware(req);

    const { username, content } = req.body;
    const photoPath = req.file ? req.file.path : null;

    // Save the post to the database
    const newPost = new Post({
      username,
      content,
      photo: photoPath,
      likes: [],
      comments: [],
    });

    await newPost.save();

    return NextResponse.json({
      message: "Post created successfully",
      post: newPost,
      status: 201,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({
      message: "Failed to create post",
      error: error.message,
      status: 500,
    });
  }
}
