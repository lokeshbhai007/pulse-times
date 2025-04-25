// authentication logic

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					role: profile.role ?? 'user',
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account.provider === 'google') {
				const { name, email, role, image } = user;

				try {
					const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							name,
							email,
							role,
							image,
						}),
					});

//  Data Sent to /api/user Endpoint:  After the Google provider authenticates the user,
//  the code sends the user's information (name, email, role, image) to the backend (via the /api/user endpoint).
//  The /api/user endpoint will either create a new user or update an existing one in the database (MongoDB).

					const data = await res.json();

					if (res.ok) {
						user.mongoId = data.data._id;
						user.role = data.data.role;
						return user;
					}
				} catch (error) {
					throw new Error(error);
				}
			}
			return null;
		},
		async jwt({ token, user }) {
			if (user) {
				token.mongoId = user.mongoId;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.mongoId = token.mongoId;
				session.user.role = token.role;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };