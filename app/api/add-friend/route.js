// pages/api/addFriend.js

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Friendship from "../../../models/Friendship";
import User from "../../../models/User";

export async function POST(req) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { userId, toUserId } = await req.json(); // Assuming `userId` (current user) and `toUserId` (friend) are passed in the request body

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const fromUser = await User.findById(userId);
      if (!fromUser) {
        return NextResponse.json(
          { error: "Requesting user not found" },
          { status: 404 }
        );
      }

      // Create a new friendship request
      const friendship = await Friendship.create({
        to_user: toUserId,
        from_user: userId,
        status: "pending",
      });

      // Ensure friends arrays are initialized
      toUser.friends = toUser.friends || []; // Initialize if undefined
      fromUser.friends = fromUser.friends || []; // Initialize if undefined

      // Add friendship ID to both users' friends arrays
      toUser.friends.push(friendship._id);
      fromUser.friends.push(friendship._id);

      // Save both users
      await toUser.save();
      await fromUser.save();

      return NextResponse.json(
        { message: "Friend request sent successfully" },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error adding friend:", err);
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
