import { UserRole } from "./lib/generated/prisma";
import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// ✅ Extend user session type
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  provider?: string; 
  githubAccessToken?: string; // ✅ GitHub token included
};

// ✅ Extend NextAuth session
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

// ✅ Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    provider?: string;
    githubAccessToken?: string; // ✅ add this line
  }
}
