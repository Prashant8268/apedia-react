// pages/api/removeFriend.js

import dbConnect from "../../../lib/mongodb";
import Friendship from "../../../models/Friendship";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await dbConnect();

  const { id } = await req.json(); // Assuming the friendship ID is passed as a query parameter

  try {
    // Find and remove the friendship
    const friendship = await Friendship.findByIdAndRemove(id);
    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      );
    }

    // Update the friend lists of both users
    const fromUser = await User.findById(friendship.from_user);
    if (fromUser) {
      fromUser.friends.pull(friendship._id);
      fromUser.friendsName.pull(friendship.to_user);
      await fromUser.save();
    }

    const toUser = await User.findById(friendship.to_user);
    if (toUser) {
      toUser.friends.pull(friendship._id);
      toUser.friendsName.pull(friendship.from_user);
      await toUser.save();
    }

    return NextResponse.json(
      { message: "Friendship removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
