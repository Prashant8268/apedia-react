// pages/api/toggle-like.js

import dbConnect from "@/lib/mongodb";
import Like from "@/models/Like";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
export  async function POST(req, res) {
  await dbConnect(); // Ensure to connect to your database

  if (req.method !== "POST") {
    return NextResponse.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, type ,token } =await req.json(); 
    const user = jwt.verify(token,process.env.JWT_SECRET);

    let likeable;
    let deleted = false;
    if (type == "Post") {
      likeable = await Post.findById(id).populate("likes");
    } else {
      likeable = await Comment.findById(id).populate("likes");
    }
    const existingLike = await Like.findOne({
      likeable: id,
      onModel: type,
      user: user.userId, 
    });

    if (existingLike) {
      await likeable.likes.pull(existingLike._id);
      await likeable.save();
      deleted = true;
      await Like.deleteOne({ _id: existingLike._id });
    } else {
      const newLike = await Like.create({
        user: user.userId,
        likeable: id,
        onModel: type,
      });
      likeable.likes.push(newLike._id);
      await likeable.save();
    }


    return NextResponse.json({
      message: "Request successful",
      data: {
        deleted: deleted,
        likesCount: likeable.likes.length,
        likeable
      },
    });
  } catch (err) {
    console.error(err, "<<- Error in toggle-like handler");
    return NextResponse.json({ message: "Internal server error" },{status:500});
  }
}
