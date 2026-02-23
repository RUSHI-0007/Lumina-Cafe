/**
 * Admin Server Actions
 *
 * Privileged operations for menu, order, and reservation management.
 * Every action is protected by `requireAdmin()` — only emails in
 * the ADMIN_EMAILS whitelist can execute these.
 *
 * @module actions/admin
 */

"use server";

import { requireAdmin } from "@/lib/auth/auth-guard";
import { CreateProductSchema, UpdateProductSchema } from "@/types/product";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
} from "@/services/product.service";
import { getRecentOrders, updateOrderStatus } from "@/services/order.service";
import {
    getReservationsByDate,
    updateReservationStatus,
} from "@/services/reservation.service";
import { UpdateOrderStatusSchema } from "@/types/order";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

// ─── Product Management ───

export async function createMenuItem(formData: unknown) {
    await requireAdmin();
    const parsed = CreateProductSchema.safeParse(formData);
    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
        };
    }
    const result = await createProduct(parsed.data);
    revalidatePath("/admin");
    return result;
}

export async function updateMenuItem(id: string, formData: unknown) {
    await requireAdmin();
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid product ID" };
    }
    const parsed = UpdateProductSchema.safeParse(formData);
    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
        };
    }
    const result = await updateProduct(id, parsed.data);
    revalidatePath("/admin");
    return result;
}

export async function updateProductPrice(id: string, price: number) {
    await requireAdmin();
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid product ID" };
    }
    if (typeof price !== "number" || price <= 0 || price > 999.99) {
        return { success: false as const, error: "Price must be between $0.01 and $999.99" };
    }
    const result = await updateProduct(id, { price });
    revalidatePath("/admin");
    return result;
}

export async function toggleSoldOut(id: string, isSoldOut: boolean) {
    await requireAdmin();
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid product ID" };
    }
    const result = await updateProduct(id, { isSoldOut });
    revalidatePath("/admin/menu");
    revalidatePath("/");
    return result;
}

export async function deleteMenuItem(id: string) {
    await requireAdmin();
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid product ID" };
    }
    const result = await deleteProduct(id);
    revalidatePath("/admin");
    return result;
}

// ─── Order Management ───

export async function getAdminProducts() {
    await requireAdmin();
    return getProducts();
}

export async function getAdminOrders(limit?: number) {
    await requireAdmin();
    return getRecentOrders(limit);
}

export async function updateAdminOrderStatus(id: string, statusData: unknown) {
    await requireAdmin();
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid order ID" };
    }
    const parsed = UpdateOrderStatusSchema.safeParse(statusData);
    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
        };
    }
    const result = await updateOrderStatus(id, parsed.data.status);
    revalidatePath("/admin");
    return result;
}

// ─── Reservation Management ───

export async function getAdminReservations() {
    await requireAdmin();
    // Fetch reservations from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservations = await prisma.reservation.findMany({
        where: {
            date: { gte: today },
        },
        orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    });

    return {
        success: true as const,
        data: reservations.map((r) => ({
            ...r,
            date: r.date.toISOString(),
        })),
    };
}

export async function updateAdminReservationStatus(
    id: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
) {
    await requireAdmin();
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid reservation ID" };
    }
    const result = await updateReservationStatus(id, status);
    revalidatePath("/admin/reservations");
    return result;
}
