/**
 * Global Error Handling for Database Operations
 *
 * Provides a typed `Result<T>` pattern and a `withDb` wrapper that catches
 * Prisma-specific errors and converts them into user-friendly messages.
 *
 * @module lib/db/errors
 */

// ─── Result Type ───

/** Discriminated union for database operation results */
export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

/**
 * Create a successful result
 * @param data - The data payload
 */
export function ok<T>(data: T): Result<T> {
    return { success: true, data };
}

/**
 * Create a failed result
 * @param error - Human-readable error message
 */
export function err<T>(error: string): Result<T> {
    return { success: false, error };
}

// ─── Prisma Error Mapping ───

/**
 * Maps Prisma error codes to human-readable messages.
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const PRISMA_ERROR_MAP: Record<string, string> = {
    P2002: "A record with this unique value already exists.",
    P2003: "Cannot complete this action — a related record is required.",
    P2025: "The requested record was not found.",
    P2014: "This change would violate a required relation.",
    P2016: "Query interpretation error.",
    P2021: "The database table does not exist.",
    P2022: "The database column does not exist.",
};

/**
 * Checks if an error is a Prisma known request error (has a `code` property).
 */
function isPrismaKnownError(error: unknown): error is { code: string; message: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as Record<string, unknown>).code === "string"
    );
}

/**
 * Wraps a database operation with standardized error handling.
 *
 * Catches Prisma-specific errors (unique constraint violations, record not found, etc.)
 * and returns a typed `Result<T>` instead of throwing.
 *
 * @param operation - Async function that performs the database operation
 * @returns `Result<T>` — either `{ success: true, data }` or `{ success: false, error }`
 *
 * @example
 * ```ts
 * const result = await withDb(() =>
 *   prisma.product.findMany({ where: { category: 'ESPRESSO' } })
 * );
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function withDb<T>(
    operation: () => Promise<T>
): Promise<Result<T>> {
    try {
        const data = await operation();
        return ok(data);
    } catch (error: unknown) {
        // Handle Prisma known request errors (have a `code` field like P2002, P2025, etc.)
        if (isPrismaKnownError(error)) {
            const message =
                PRISMA_ERROR_MAP[error.code] ??
                `Database error (${error.code}): ${error.message}`;
            console.error(`[DB Error] ${error.code}:`, error.message);
            return err(message);
        }

        // Handle standard Error instances
        if (error instanceof Error) {
            console.error("[DB Error]:", error.message);
            return err(error.message);
        }

        // Unknown errors
        console.error("[DB Unknown Error]:", error);
        return err("An unexpected error occurred. Please try again.");
    }
}
