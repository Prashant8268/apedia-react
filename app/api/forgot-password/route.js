import dbConnect from "@/lib/mongodb";
import { generateResetToken, saveResetToken } from "../../../lib/resetToken";
import { NextResponse } from "next/server";
import User from "../../../models/User";
import { Worker } from "worker_threads";
import path from "path";

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

    // Offload email sending to a worker thread
    const worker = new Worker(path.resolve("./workers/nodemailer.js"), {
      workerData: { email, resetToken },
    });

    worker.on("message", (message) => {
      if (!message.success) {
        console.error("Worker failed to send email:", message.error);
      }
    });

    worker.on("error", (error) => {
      console.error("Worker thread error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
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
