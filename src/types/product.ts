/**
 * Product Zod Schemas & TypeScript Types
 *
 * Validation schemas for all product-related operations:
 * creating, updating, filtering menu items.
 *
 * @module types/product
 */

import { z } from "zod";

/** Valid product categories */
export const ProductCategoryEnum = z.enum([
    "ESPRESSO",
    "POUR_OVER",
    "COLD_BREW",
    "PASTRY",
    "SEASONAL",
    "MERCHANDISE",
]);

/**
 * Schema for creating a new product.
 * Validates name, description, price, category, and optional fields.
 */
export const CreateProductSchema = z.object({
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters")
        .max(100, "Product name must be under 100 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be under 500 characters"),
    price: z
        .number()
        .positive("Price must be positive")
        .max(999.99, "Price cannot exceed $999.99"),
    category: ProductCategoryEnum,
    imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
    isFeatured: z.boolean().optional().default(false),
    sortOrder: z.number().int().min(0).optional().default(0),
});

/**
 * Schema for updating an existing product.
 * All fields are optional — only provided fields are updated.
 */
export const UpdateProductSchema = z.object({
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters")
        .max(100)
        .optional(),
    description: z.string().min(10).max(500).optional(),
    price: z.number().positive().max(999.99).optional(),
    category: ProductCategoryEnum.optional(),
    imageUrl: z.string().url().optional().nullable(),
    isSoldOut: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
});

/**
 * Schema for filtering products (e.g., by category or availability).
 */
export const ProductFilterSchema = z.object({
    category: ProductCategoryEnum.optional(),
    isSoldOut: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});

// ─── Inferred Types ───

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
export type ProductCategory = z.infer<typeof ProductCategoryEnum>;
