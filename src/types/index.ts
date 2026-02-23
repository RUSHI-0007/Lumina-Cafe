/**
 * Types Barrel Export
 *
 * Re-exports all Zod schemas and TypeScript types from domain modules.
 *
 * @module types
 */

// Product types
export {
    ProductCategoryEnum,
    CreateProductSchema,
    UpdateProductSchema,
    ProductFilterSchema,
    type CreateProductInput,
    type UpdateProductInput,
    type ProductFilter,
    type ProductCategory,
} from "./product";

// Order types
export {
    OrderStatusEnum,
    OrderItemSchema,
    CreateOrderSchema,
    UpdateOrderStatusSchema,
    type CreateOrderInput,
    type OrderItemInput,
    type UpdateOrderStatusInput,
    type OrderStatus,
} from "./order";

// Reservation types
export {
    ReservationStatusEnum,
    CreateReservationSchema,
    ReservationFilterSchema,
    CheckAvailabilitySchema,
    type CreateReservationInput,
    type ReservationFilter,
    type CheckAvailabilityInput,
    type ReservationStatus,
} from "./reservation";
