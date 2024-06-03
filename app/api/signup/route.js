// pages/api/signup.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { NextResponse } from "next/server";
// import  { NextApiRequest, NextApiResponse } from 'next'

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

export async function POST(req,res) {

    if (req.method === 'POST') {
        await dbConnect();

        // const multer = require('multer');
        // const storage = User.uploadedAvatar.storage;
        // const upload = multer({ storage });

        // upload(req, res, async (err) => {
        //     if (err) {
        //         return res.status(500).json({ message: 'Upload error', error: err.message });
        //     }

            const { email, password, name } = await req.json();


        console.log(email,password,name)
            // const avatar = req.file ? req.file.path : null;

            if (!email || !password || !name) {
                return NextResponse.json({ message: 'Missing required fields' },{status:400});
            }

            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return NextResponse.json({ message: 'User already exists' },{status:200});
                }

                const newUser = new User({
                    email,
                    password,
                    name,
                    // avatar,
                });

                await newUser.save();
              return   NextResponse.json({ message: 'User created successfully', user: newUser },{status:201});
            } catch (error) {
                console.error('Error in sign-up API:', error);
               return NextResponse.json({ message: 'Internal server error' },{status:500});
            }
        // });
    } else {
       return  NextResponse.setHeader('Allow', ['POST']);
        return NextResponse.end(`Method ${req.method} not allowed`);
    }
}
