// pages/api/addFriend.js

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Friendship from "../../../models/Friendship";
import User from "../../../models/User";

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, profileId, action } = await req.json(); // Include action in the request body

    const toUser = await User.findById(profileId);
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

    if (action === "add") {
      // Check if a friendship already exists
      const existingFriendship = await Friendship.findOne({
        $or: [
          { from_user: userId, to_user: profileId },
          { from_user: profileId, to_user: userId },
        ],
      });

      if (existingFriendship) {
        return NextResponse.json(
          { error: "Friend request already exists" },
          { status: 400 }
        );
      }

      // Create a new friendship request
      await Friendship.create({
        to_user: profileId,
        from_user: userId,
        status: "pending",
      });

      return NextResponse.json(
        { message: "Friend request sent successfully" },
        { status: 200 }
      );
    } else if (action === "cancel") {
      // Cancel the friend request
      const canceledRequest = await Friendship.findOneAndDelete({
        from_user: userId,
        to_user: profileId,
        status: "pending",
      });

      if (!canceledRequest) {
        return NextResponse.json(
          { error: "No pending friend request to cancel" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Friend request canceled" },
        { status: 200 }
      );
    } else if (action === "accept") {
      // Accept the friend request
      const friendship = await Friendship.findOneAndUpdate(
        { from_user: profileId, to_user: userId, status: "pending" },
        { status: "accepted" },
        { new: true }
      );

      if (!friendship) {
        return NextResponse.json(
          { error: "No pending request to accept" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Friend request accepted" },
        { status: 200 }
      );
    } else if (action === "remove") {
      // Remove a friend
      const removedFriendship = await Friendship.findOneAndDelete({
        $or: [
          { from_user: userId, to_user: profileId },
          { from_user: profileId, to_user: userId },
        ],
        status: "accepted",
      });

      if (!removedFriendship) {
        return NextResponse.json(
          { error: "No friendship found to remove" },
          { status: 400 }
        );
      }

      return NextResponse.json({ message: "Friend removed" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Error handling friend request:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
