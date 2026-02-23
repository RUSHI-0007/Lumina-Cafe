/**
 * Prisma Configuration — Lumina Café
 *
 * Prisma 7 requires connection URLs to be defined here
 * instead of in schema.prisma.
 *
 * Uses DIRECT_URL (port 5432) for CLI operations (push, migrate).
 * The pooled DATABASE_URL (port 6543) is used at runtime by PrismaClient.
 *
 * @see https://pris.ly/d/config-datasource
 */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Attempt Prisma native env, fallback to Node injected env (Vercel)
    url: env("DIRECT_URL") || process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});