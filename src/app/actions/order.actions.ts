/**
 * Order Server Actions
 *
 * Server actions for placing and tracking orders.
 * Validates input with Zod before delegating to the order service.
 *
 * @module actions/order
 */

"use server";

import { CreateOrderSchema } from "@/types/order";
import { createOrder, getOrderById } from "@/services/order.service";

/**
 * Place a new order.
 *
 * Validates the incoming data with Zod, then creates the order
 * with automatic price lookup and total calculation.
 *
 * @param formData - Raw order data from the client
 */
export async function placeOrder(formData: unknown) {
    const parsed = CreateOrderSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
        };
    }

    return createOrder(parsed.data);
}

/**
 * Retrieve order status and details.
 *
 * @param orderId - The order CUID to look up
 */
export async function getOrderStatus(orderId: string) {
    if (!orderId || typeof orderId !== "string") {
        return { success: false as const, error: "Invalid order ID" };
    }

    return getOrderById(orderId);
}
