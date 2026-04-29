import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        // next-auth auto-stores user.image as token.picture
      }
      // Allow server-side session updates (e.g. after profile save)
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.image !== undefined) token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        // token.id is set on new logins; fall back to token.sub (next-auth built-in) for existing sessions
        session.user.id = (token.id || token.sub) as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;