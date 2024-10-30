// pages/api/signup.js
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    const { email, password, name } = await req.json();

    // Convert email to lowercase to ensure case-insensitivity
    const lowerCaseEmail = email?.toLowerCase();

    console.log(lowerCaseEmail, password, name);

    if (!lowerCaseEmail || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Check if a user already exists with the lowercase email
      const existingUser = await User.findOne({ email: lowerCaseEmail });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 200 }
        );
      }

      // Create a new user with the email in lowercase
      const newUser = new User({
        email: lowerCaseEmail,
        password,
        name,
      });

      await newUser.save();
      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error in sign-up API:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.setHeader("Allow", ["POST"]);
    return NextResponse.end(`Method ${req.method} not allowed`);
  }
}
