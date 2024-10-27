import dbConnect from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    let user = await User.findById(id);
    const userData = {
      name: user.name,
      email: user.email,
      id: user._id,
      avatarUrl: user.avatarUrl
    };

    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
