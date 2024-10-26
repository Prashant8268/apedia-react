// pages/api/acceptRequest.js

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Friendship from '../../../models/Friendship';
import User from "../../../models/User";


export default async function POST(req) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { id } = await req.json(); 
      const friendship = await Friendship.findById(id);

      if (!friendship) {
        return NextResponse.json(
          { error: "Friendship request not found" },
          { status: 404 }
        );
      }

      const user1 = await User.findById(friendship.from_user);
      const user2 = await User.findById(friendship.to_user);

      if (!user1 || !user2) {
        return NextResponse.json({ error: "Users not found" }, { status: 404 });
      }

      // Add each user to the other's friends list
      user1.friendsName.push(user2.id);
      user2.friendsName.push(user1.id);

      // Update friendship status to accepted
      friendship.status = "accepted";
      await friendship.save();
      await user1.save();
      await user2.save();

      return NextResponse.json(
        { message: "Request Accepted" },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error accepting request:", err);
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
