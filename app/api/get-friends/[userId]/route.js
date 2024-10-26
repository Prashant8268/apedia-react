import dbConnect from "../../../../lib/mongodb"; // Adjust the path according to your project structure
import User from "../../../../models/User";
import Friendship from "../../../../models/Friendship"; // Import the Friendship model
import { NextResponse } from "next/server"; // Import NextResponse

export async function GET(req, { params }) {
  const { userId } = params; // Extract userId from params

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect(); // Connect to the database

    // Find the user by userId
    const user = await User.findById(userId); // No need to populate friends here

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch friendships related to the user
    const friendships = await Friendship.find({
      $or: [
        { from_user: userId }, // User initiated the request
        { to_user: userId }, // User is receiving the request
      ],
    }).populate("from_user to_user"); // Populate both users for details

    // Initialize arrays to categorize friendships
    const acceptedFriends = [];
    const friendRequests = [];

    // Iterate through the friendships to categorize them
    friendships.forEach((friendship) => {
      if (friendship.status === "accepted") {
        if (friendship.from_user._id.toString() === userId) {
          acceptedFriends.push(friendship.to_user); // Add the friend if the user is the `from_user`
        } else {
          acceptedFriends.push(friendship.from_user); // Add the friend if the user is the `to_user`
        }
      } else if (friendship.status === "pending") {
        if (friendship.to_user.toString() === userId) {
          friendRequests.push(friendship.from_user); // Add to friend requests if user is the `to_user`
        }
      }
    });

    return NextResponse.json(
      { acceptedFriends, friendRequests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
