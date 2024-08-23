// pages/api/reset-password-request.js
import dbConnect from "@/lib/mongodb";
import { generateResetToken, saveResetToken } from "../../../lib/resetToken";
import { sendResetEmail } from "../../../lib/nodemailer";
import { NextResponse } from "next/server";
import User from '../../../models/User'
export async function POST(req, res) {
  if (req.method === "POST") {
    const { email } = await req.json();
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "No user found with this email address.",
        status: 400,
      });
    }

    // Generate a password reset token
    const resetToken = await generateResetToken();

    // Save the reset token in the database
    try {
      await saveResetToken(user.id, resetToken);
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: "Error saving reset token.",
      });
    }

    // Send the reset email
    try {
      sendResetEmail(email, resetToken);
      return NextResponse.json({
        message: "Reset link sent to your email address.",
        status: 200,
      });
    } catch (error) {
      return NextResponse.json({
        message: error.message || "Error sending reset email.",
        status: 500,
      });
    }
  } else {
    return NextResponse.json({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}
