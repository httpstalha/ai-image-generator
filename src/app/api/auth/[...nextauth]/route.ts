import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';

// Custom Yahoo OAuth 2.0 Provider
const YahooProvider = (options: { clientId: string; clientSecret: string }) => ({
  id: 'yahoo',
  name: 'Yahoo',
  type: 'oauth' as const,
  authorization: {
    url: 'https://api.login.yahoo.com/oauth2/request_auth',
    params: { scope: 'openid profile email' },
  },
  token: 'https://api.login.yahoo.com/oauth2/get_token',
  userinfo: 'https://api.login.yahoo.com/openid/v1/userinfo',
  profile(profile: any) {
    return {
      id: profile.sub || profile.guid || `yahoo_${Date.now()}`,
      name: profile.name || profile.nickname || 'Yahoo User',
      email: profile.email || 'user.yahoo@yahoo.com',
      image: profile.picture || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    };
  },
  clientId: options.clientId,
  clientSecret: options.clientSecret,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'google_oauth_client_id_cerulia',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google_oauth_client_secret_cerulia',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    YahooProvider({
      clientId: process.env.YAHOO_CLIENT_ID || 'yahoo_oauth_client_id_cerulia',
      clientSecret: process.env.YAHOO_CLIENT_SECRET || 'yahoo_oauth_client_secret_cerulia',
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || 'apple_oauth_client_id_cerulia',
      clientSecret: process.env.APPLE_CLIENT_SECRET || 'apple_oauth_client_secret_cerulia',
    }),
    CredentialsProvider({
      name: 'Email Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: `usr_${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider || 'email';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'cerulia_ai_nextauth_production_secret_key_998877',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
