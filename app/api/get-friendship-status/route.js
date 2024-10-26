// pages/api/get-friendship-status.js

import dbConnect from "../../../lib/mongodb";
import Friendship from "../../../models/Friendship";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  if (req.method !== "GET") {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const profileId = searchParams.get("profileId");
  console.log(userId, profileId, 'value')
  try { 
    // Find the friendship document between the two users
    const friendship = await Friendship.findOne({
      $or: [
        { from_user: userId, to_user: profileId },
        { from_user: profileId, to_user: userId },
      ],
    });
    console.log(friendship, 'frienship');
    // If there's no friendship document, they are not friends
    if (!friendship) {
      return NextResponse.json({ status: "not_friends" }, { status: 200 });
    }

    // Determine the relationship status
    let status;
    if (friendship.status === "accepted") {
      status = "friends"; // They are friends
    } else if (friendship.status === "pending") {
      // Determine who sent the request
      if (friendship.from_user.toString() === userId) {
        status = "request_sent"; // User sent the request
      } else {
        status = "request_received"; // User received the request
      }
    } else if (friendship.status === "rejected") {
      status = "not_friends"; // If rejected, they're not friends anymore
    }

    return NextResponse.json(
      {
        status,
        friendshipId: friendship._id,
        initiator: friendship.from_user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching friendship status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
