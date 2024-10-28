import dbConnect from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Email from "next-auth/providers/email";
import Friendship from "@/models/Friendship";
export async function GET(req) {
  try {
    await dbConnect();
    const all = await User.find({}, "id avatarUrl name");
    return NextResponse.json({message: "Successfull",users:all},{status:200});
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
