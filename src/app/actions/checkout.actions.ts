"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface CartItemInput {
    productId: string;
    quantity: number;
    unitPrice: number;
}

/**
 * Handle a simulated checkout flow for client demos.
 * 
 * 1. Creates order as PENDING
 * 2. Simulates network latency (2 seconds)
 * 3. Updates order to PAID
 * 4. Increments loyalty points
 */
export async function processMockPayment(items: CartItemInput[], totalAmount: number) {
    try {
        const { userId } = await auth();
        let dbUserId = null;

        if (userId) {
            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
            });
            if (user) {
                dbUserId = user.id;
            }
        }

        // 1. Create the order as PENDING initially
        const order = await prisma.order.create({
            data: {
                customerName: dbUserId ? "Customer" : "Guest",
                totalAmount,
                status: "PENDING",
                userId: dbUserId,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
        });

        // 2. Artificial delay to simulate payment gateway latency
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 3. Update status to PAID & increment loyalty
        await prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: order.id },
                data: { status: "PAID" },
            });

            if (dbUserId) {
                await tx.user.update({
                    where: { id: dbUserId },
                    data: { loyaltyPoints: { increment: 1 } },
                });
            }
        });

        // Revalidate public dashboard routes and admin routes
        revalidatePath("/dashboard");
        revalidatePath("/admin");

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Error processing mock payment:", error);
        return { success: false, error: "Failed to process payment." };
    }
}
