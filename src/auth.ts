import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user and join their role
        const userRecords = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            password: users.password,
            roleName: roles.name,
            avatarUrl: users.avatarUrl,
          })
          .from(users)
          .leftJoin(roles, eq(users.roleId, roles.id))
          .where(eq(users.email, credentials.email as string));
          
        const user = userRecords[0];

        // If user doesn't exist or has no password
        if (!user || !user.password) return null;

        // Verify the password hash
        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!passwordsMatch) return null;

        // Return the user object to save in the session
        return { id: user.id.toString(), name: user.name, email: user.email, role: user.roleName || 'User', image: user.avatarUrl || null };
      },
    }),
  ],
});