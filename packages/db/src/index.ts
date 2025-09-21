import { PrismaClient } from "@prisma/client";
import { glob } from "fs";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV === "development") global.prisma = prismaClient;

export default prismaClient;
