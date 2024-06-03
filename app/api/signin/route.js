import dbConnect from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { NextResponse } from "next/server";

export async function POST(req,res) {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed' },{ status: 200 });
    }
    await dbConnect();
  
    try {
      const { email, password } = await req.json();
      console.log('Request Body:', { email, password });
  
      if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required' },{ status: 400 });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return NextResponse.json({ message: 'Invalid email or password' },{ status: 401 });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid email or password' },{ status: 401 });
      }
  
      return NextResponse.json({ message: 'Sign in successful', user: { email: user.email, username: user.username }},{ status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ message: 'Internal server error' },{ status: 500 });
    }
  }
  