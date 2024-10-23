import dbConnect from "@/lib/mongodb";
import User from "../../../models/User";
import ResetToken from "../../../models/ResetToken";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method === "POST") {
    const { token, password } = await req.json();

    await dbConnect();
    // Find the reset token
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({
        message: "Invalid or expired token.",
        status: 400,
      });
    }

    // Find the user by ID
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found.", status: 404 });
    }

    // Hash the new password

    user.password = password;
    await user.save();

    // Remove the used reset token
    await ResetToken.deleteOne({ token });

    return NextResponse.json({
      message: "Password reset successfully.",
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}
