import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismaGlobal?: PrismaClient;
};

export const db =
  globalForPrisma.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaGlobal = db;
