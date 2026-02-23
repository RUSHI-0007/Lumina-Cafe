/**
 * Order Zod Schemas & TypeScript Types
 *
 * Validation schemas for order creation and status management.
 *
 * @module types/order
 */

import { z } from "zod";

/** Valid order statuses */
export const OrderStatusEnum = z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
]);

/**
 * Schema for a single order line item.
 * Requires a valid product ID and a positive quantity.
 */
export const OrderItemSchema = z.object({
    productId: z.string().cuid("Invalid product ID"),
    quantity: z
        .number()
        .int("Quantity must be a whole number")
        .positive("Quantity must be at least 1")
        .max(50, "Maximum 50 of a single item per order"),
});

/**
 * Schema for creating a new order.
 * Requires customer info and at least one item.
 */
export const CreateOrderSchema = z.object({
    customerName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters"),
    customerEmail: z
        .string()
        .email("Must be a valid email address")
        .optional()
        .nullable(),
    notes: z.string().max(500, "Notes must be under 500 characters").optional().nullable(),
    items: z
        .array(OrderItemSchema)
        .min(1, "Order must contain at least one item")
        .max(20, "Maximum 20 different items per order"),
});

/**
 * Schema for updating order status.
 * Ensures only valid status transitions are provided.
 */
export const UpdateOrderStatusSchema = z.object({
    status: OrderStatusEnum,
});

// ─── Inferred Types ───

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
