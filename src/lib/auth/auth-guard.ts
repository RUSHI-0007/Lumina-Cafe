"use server";

import { currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

/**
 * Verify the current Clerk user is an admin.
 * Throws if unauthenticated or email not in ADMIN_EMAILS whitelist.
 */
export async function requireAdmin() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized: not signed in");

    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
    if (!email || !ADMIN_EMAILS.includes(email)) {
        throw new Error("Forbidden: admin access required");
    }

    return { userId: user.id, email };
}
