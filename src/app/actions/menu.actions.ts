/**
 * Menu Server Actions
 *
 * Public server actions for fetching menu data.
 * These are called from React Server Components or client-side forms.
 *
 * @module actions/menu
 */

"use server";

import { getProducts, getProductsByCategory, getProductById } from "@/services/product.service";
import { ProductFilterSchema } from "@/types/product";

/**
 * Fetch all menu items grouped by category.
 * Used to render the full menu page.
 */
export async function getMenuByCategory() {
    return getProductsByCategory();
}

/**
 * Fetch menu items for a specific category.
 *
 * @param category - The product category to filter by
 */
export async function getMenuItems(category?: string) {
    const filter = category
        ? ProductFilterSchema.parse({ category, isSoldOut: false })
        : { isSoldOut: false };

    return getProducts(filter);
}

/**
 * Fetch details for a single menu item.
 *
 * @param id - Product CUID
 */
export async function getProductDetails(id: string) {
    if (!id || typeof id !== "string") {
        return { success: false as const, error: "Invalid product ID" };
    }
    return getProductById(id);
}
