"use server";

import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    // Upsert the user to keep the DB in sync with Clerk
    const user = await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
            email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            imageUrl: clerkUser.imageUrl,
        },
        create: {
            clerkId: clerkUser.id,
            email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            imageUrl: clerkUser.imageUrl,
        },
        include: {
            subscriptions: true,
            orders: {
                orderBy: { createdAt: "desc" },
                take: 5,
                include: { items: { include: { product: true } } },
            },
        },
    });

    return user;
}

export async function updateSubscription(frequency: "WEEKLY" | "BI_WEEKLY" | "MONTHLY") {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
        if (!user) return { success: false, error: "User not found" };

        const subscription = await prisma.subscription.findFirst({
            where: { userId: user.id },
        });

        if (subscription) {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: { frequency, isActive: true },
            });
        } else {
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    frequency,
                },
            });
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error updating subscription:", error);
        return { success: false, error: "Failed to update subscription" };
    }
}

export async function quickReorder() {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id },
            include: {
                orders: {
                    where: { isFavorite: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    include: { items: true },
                },
            },
        });

        if (!user) return { success: false, error: "User not found" };

        // If no favorite order, fallback to the most recent order
        let favoriteOrder = user.orders[0];
        if (!favoriteOrder) {
            const recentOrder = await prisma.order.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" },
                include: { items: true },
            });
            if (recentOrder) {
                favoriteOrder = recentOrder;
            } else {
                return { success: false, error: "No past orders found to reorder." };
            }
        }

        // Create a new order duplicating the favorite one
        const newOrder = await prisma.order.create({
            data: {
                customerName: user.name || "Customer",
                customerEmail: user.email,
                totalAmount: favoriteOrder.totalAmount,
                userId: user.id,
                status: "PENDING",
                items: {
                    create: favoriteOrder.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
        });

        // Increment loyalty points
        await prisma.user.update({
            where: { id: user.id },
            data: { loyaltyPoints: { increment: 1 } },
        });

        revalidatePath("/dashboard");
        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error("Error processing quick reorder:", error);
        return { success: false, error: "Failed to process quick reorder" };
    }
}
