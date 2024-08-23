import dbConnect from "@/lib/mongodb";
import { generateResetToken, saveResetToken } from "../../../lib/resetToken";
import { sendResetEmail } from "../../../lib/nodemailer";
import { NextResponse } from "next/server";
import User from "../../../models/User";

export async function POST(req, res) {
  if (req.method === "POST") {
    const { email } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "No user found with this email address.",
        status: 400,
      });
    }

    const resetToken = await generateResetToken();

    try {
      await saveResetToken(user.id, resetToken);
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: "Error saving reset token.",
      });
    }

    // Asynchronously send the email
    setImmediate(() => {
      try {
        sendResetEmail(email, resetToken);
      } catch (error) {
        console.error("Error sending reset email:", error);
      }
    });

    return NextResponse.json({
      message: "Reset link sent to your email address.",
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}
