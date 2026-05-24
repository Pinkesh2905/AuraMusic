import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError" | string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    id?: string;
  }
}
