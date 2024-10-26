// pages/api/get-friendship-status.js

import dbConnect from "../../../lib/mongodb"; // Import your database connection utility
import Friendship from "../../../models/Friendship"; // Adjust to your Friendship model path
import { NextResponse } from "next/server"; // Import NextResponse

export  async function GET(req) {
  await dbConnect();

  if (req.method === "GET") {

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const friendId = searchParams.get("friendId");
    if (!userId || !friendId) {
      return NextResponse.json(
        { error: "User ID and Friend ID are required." },
        { status: 400 }
      );
    }

    try {
      // Check for existing friendship
      const friendship = await Friendship.findOne({
        $or: [
          { from_user: userId, to_user: friendId },
          { from_user: friendId, to_user: userId },
        ],
      });

      // Determine the status
      const status = friendship ? friendship.status : null; // Will be 'accepted' or 'pending'

      return NextResponse.json({ status });
    } catch (err) {
      console.error("Error checking friendship status:", err);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }
}
