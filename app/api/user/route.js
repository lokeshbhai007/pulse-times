// The /api/user endpoint is used to handle user creation or user update 
// in your backend when a user logs in using Google authentication via NextAuth.js.

import { connectMongoDB } from '@/lib/mongoDB';
import User from '@/models/userModels';
import { NextResponse } from 'next/server';


// The handler is designed to respond to POST requests made to this API route (/api/user).
export async function POST(request) {
	try {
		const { name, email, image } = await request.json();
		await connectMongoDB();
		const userExists = await User.findOne({ email });
		if (userExists) {
			userExists.name = name;
			userExists.image = image;
			const updatedUser = await userExists.save();

			return NextResponse.json(
				{ message: 'User Exits', data: updatedUser },
				{ status: 200 }
			);
		}

		const newUser = await new User({ name, email, image });
		const createdUser = await newUser.save();

		if (createdUser) {
			return NextResponse.json(
				{ message: 'User created', data: createdUser },
				{ status: 201 }
			);
		}
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 500 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}


//The /api/user endpoint ensures that user information (such as name, email, image, etc.)
//  is stored in your database (MongoDB). This allows for user data to be persistent across
//  sessions and not just stored in NextAuth's session.



//The /api/user endpoint provides an essential backend service for user management.
// It ensures that when users log in through Google OAuth via NextAuth, 
// their data is saved or updated in your MongoDB database, and the latest data is available for use across sessions.