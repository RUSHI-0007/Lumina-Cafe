/**
 * Product Service
 *
 * Domain logic for menu management. All methods return `Result<T>`
 * via the `withDb` error-handling wrapper.
 *
 * @module services/product.service
 */

import { prisma } from "@/lib/db/prisma";
import { withDb, type Result } from "@/lib/db/errors";
import type { CreateProductInput, UpdateProductInput, ProductFilter } from "@/types/product";

/**
 * Fetch all products, optionally filtered by category and availability.
 *
 * @param filter - Optional filters for category, sold-out status, or featured flag
 * @returns List of products sorted by `sortOrder` then `createdAt`
 */
export async function getProducts(
    filter?: ProductFilter
): Promise<Result<unknown[]>> {
    return withDb(() =>
        prisma.product.findMany({
            where: {
                ...(filter?.category && { category: filter.category }),
                ...(filter?.isSoldOut !== undefined && { isSoldOut: filter.isSoldOut }),
                ...(filter?.isFeatured !== undefined && { isFeatured: filter.isFeatured }),
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        })
    );
}

/**
 * Fetch products grouped by category.
 * Useful for rendering menu sections on the frontend.
 *
 * @returns Products organized by category with count
 */
export async function getProductsByCategory(): Promise<
    Result<Record<string, unknown[]>>
> {
    return withDb(async () => {
        const products = await prisma.product.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });

        const grouped: Record<string, unknown[]> = {};
        for (const product of products) {
            const cat = product.category;
            if (!grouped[cat]) grouped[cat] = [];
            // Convert Decimal to number so the result serializes across the RSC boundary
            grouped[cat].push({
                ...product,
                price: Number(product.price),
            });
        }
        return grouped;
    });
}

/**
 * Fetch a single product by its ID.
 *
 * @param id - Product CUID
 * @returns The product, or an error if not found
 */
export async function getProductById(id: string): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.product.findUniqueOrThrow({
            where: { id },
        })
    );
}

/**
 * Create a new product (admin operation).
 *
 * @param data - Validated product data
 * @returns The newly created product
 */
export async function createProduct(
    data: CreateProductInput
): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                category: data.category,
                imageUrl: data.imageUrl ?? null,
                isFeatured: data.isFeatured ?? false,
                sortOrder: data.sortOrder ?? 0,
            },
        })
    );
}

/**
 * Update an existing product (admin operation).
 * Only provided fields in `data` are updated.
 *
 * @param id - Product CUID
 * @param data - Partial product update data
 * @returns The updated product
 */
export async function updateProduct(
    id: string,
    data: UpdateProductInput
): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.product.update({
            where: { id },
            data,
        })
    );
}

/**
 * Delete a product (admin operation).
 * Cascading deletes will remove associated order items.
 *
 * @param id - Product CUID
 * @returns The deleted product
 */
export async function deleteProduct(id: string): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.product.delete({
            where: { id },
        })
    );
}
