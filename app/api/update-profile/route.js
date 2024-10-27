import { NextResponse } from "next/server";
import path from "path";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import s3Client from "@/lib/s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req) {
  await dbConnect();

  const token = req.cookies.get("token");
  let decode;
  try {
    decode = jwt.verify(token.value, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = decode.userId;
  const data = await req.formData();
  const name = data.get("name");
  const email = data.get("email");
  const avatar = data.get("avatar");
  const requestedUserId = data.get("userId");

  if (userId !== requestedUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let avatarUrl = null;

  // Find the current user to check for an existing avatar
  const currentUser = await User.findById(userId);
  if (currentUser?.avatarUrl && avatar) {
    if (currentUser.avatarUrl) {
      const photoKey = currentUser.avatarUrl.split("/").pop(); // Get the key from the URL

      console.log("Attempting to delete photo from S3:", photoKey);
      console.log(photoKey, "key");
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/avatars/${photoKey}`,
      });

      try {
        await s3Client.send(deleteCommand);
        console.log("Successfully deleted from S3");
      } catch (deleteError) {
        console.error("Error deleting from S3:", deleteError);
      }
    }
  }

  // Upload new avatar to S3 if provided
  if (avatar) {
    avatarUrl = await uploadToS3(avatar);
  }

  try {
    // Update the user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        ...(avatarUrl && { avatarUrl }), // Update avatarUrl only if new avatar uploaded
      },
      { new: true }
    );
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        id: updatedUser._id,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// Function to upload the photo to S3
async function uploadToS3(avatar) {
  const sanitizedPhotoName = avatar.name.replace(/\s+/g, "_");
  const photoName = `${Date.now()}_${sanitizedPhotoName}`;
  const buffer = Buffer.from(await avatar.arrayBuffer());

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/avatars/${photoName}`,
    Body: buffer,
    ContentType: avatar.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/uploads/avatars/${photoName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload to S3");
  }
}
