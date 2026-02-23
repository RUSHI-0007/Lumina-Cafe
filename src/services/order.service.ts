/**
 * Order Service
 *
 * Domain logic for order processing. Handles order creation with
 * automatic total calculation, status transitions, and retrieval.
 *
 * @module services/order.service
 */

import { prisma } from "@/lib/db/prisma";
import { withDb, type Result } from "@/lib/db/errors";
import type { CreateOrderInput } from "@/types/order";

/**
 * Create a new order with line items.
 *
 * Looks up each product's current price, calculates line totals,
 * computes the order total, and creates everything in a single transaction.
 *
 * @param data - Validated order data with items
 * @returns The created order with items
 */
export async function createOrder(
    data: CreateOrderInput
): Promise<Result<unknown>> {
    return withDb(async () => {
        // Fetch all referenced products to get current prices
        const productIds = data.items.map((item) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // Validate all products exist and are available
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const item of data.items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            if (product.isSoldOut) {
                throw new Error(`"${product.name}" is currently sold out`);
            }
        }

        // Calculate total
        const totalAmount = data.items.reduce((sum, item) => {
            const product = productMap.get(item.productId)!;
            return sum + Number(product.price) * item.quantity;
        }, 0);

        // Create order + items in a transaction
        return prisma.order.create({
            data: {
                customerName: data.customerName,
                customerEmail: data.customerEmail ?? null,
                notes: data.notes ?? null,
                totalAmount,
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: Number(productMap.get(item.productId)!.price),
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, imageUrl: true },
                        },
                    },
                },
            },
        });
    });
}

/**
 * Fetch an order by ID with its line items and product details.
 *
 * @param id - Order CUID
 * @returns Order with items, or error if not found
 */
export async function getOrderById(
    id: string
): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.order.findUniqueOrThrow({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, imageUrl: true },
                        },
                    },
                },
            },
        })
    );
}

/**
 * Update the status of an order.
 *
 * @param id - Order CUID
 * @param status - New status to transition to
 * @returns The updated order
 */
export async function updateOrderStatus(
    id: string,
    status: string
): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.order.update({
            where: { id },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: { status: status as any },
        })
    );
}

/**
 * Fetch recent orders, optionally filtered by status.
 * Useful for the admin dashboard.
 *
 * @param limit - Maximum number of orders to return (default: 20)
 * @param status - Optional status filter
 * @returns List of recent orders with items
 */
export async function getRecentOrders(
    limit: number = 20,
    status?: string
): Promise<Result<unknown[]>> {
    return withDb(() =>
        prisma.order.findMany({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            where: status ? { status: status as any } : undefined,
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, imageUrl: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        })
    );
}
