import dbConnect from "@/lib/mongodb";
import { generateResetToken, saveResetToken } from "../../../lib/resetToken";
import { NextResponse } from "next/server";
import User from "../../../models/User";

import axios from "axios";

export async function POST(req) {
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
    axios.post("https://task-clerk-backend.onrender.com/reset-link", {
      resetToken,
      email,
    });

    return NextResponse.json({
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}
