import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import apiClient from './api-client';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, access_token, refresh_token } = response.data;

          if (user && access_token) {
            return {
              id: user.id,
              email: user.email,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.business_name || user.email,
              role: user.role,
              countyId: user.county_id,
              accessToken: access_token,
              refreshToken: refresh_token,
              image: user.avatar_url || null,
            };
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.countyId = user.countyId;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).countyId = token.countyId;
        (session.user as Record<string, unknown>).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
