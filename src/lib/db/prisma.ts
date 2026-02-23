/**
 * Prisma Client Singleton — Lumina Café
 *
 * Prisma 7 requires a driver adapter for direct database connections.
 * This module creates a singleton PrismaClient instance with the
 * `@prisma/adapter-pg` adapter for PostgreSQL/Supabase.
 *
 * In development, the instance is stored on `globalThis` to survive
 * Next.js hot module replacement without leaking connections.
 *
 * @module lib/db/prisma
 */

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            "DATABASE_URL environment variable is not set. " +
            "Please set it in your .env file. See .env.example for reference."
        );
    }

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });
}

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
