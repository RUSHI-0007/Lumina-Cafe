/**
 * Reservation Zod Schemas & TypeScript Types
 *
 * Validation schemas for table/tasting room bookings.
 * Includes date validation (must be future), party size limits,
 * and time slot format enforcement.
 *
 * @module types/reservation
 */

import { z } from "zod";

/** Valid reservation statuses */
export const ReservationStatusEnum = z.enum([
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
]);

/** Valid time slots for reservations (24h format) */
const TIME_SLOT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Schema for creating a new reservation.
 * Validates guest details, party size, future date, and time slot format.
 */
export const CreateReservationSchema = z.object({
    guestName: z
        .string()
        .min(2, "Guest name must be at least 2 characters")
        .max(100, "Guest name must be under 100 characters"),
    guestEmail: z.string().email("Must be a valid email address"),
    guestPhone: z
        .string()
        .min(7, "Phone number too short")
        .max(20, "Phone number too long")
        .optional()
        .nullable(),
    partySize: z
        .number()
        .int("Party size must be a whole number")
        .min(1, "Party size must be at least 1")
        .max(20, "Maximum party size is 20"),
    date: z
        .string()
        .refine(
            (val) => {
                const d = new Date(val);
                return !isNaN(d.getTime()) && d >= new Date(new Date().toDateString());
            },
            { message: "Reservation date must be today or in the future" }
        ),
    timeSlot: z
        .string()
        .regex(TIME_SLOT_REGEX, "Time slot must be in HH:MM format (e.g., 14:00)"),
    specialRequests: z
        .string()
        .max(500, "Special requests must be under 500 characters")
        .optional()
        .nullable(),
});

/**
 * Schema for filtering reservations by date.
 */
export const ReservationFilterSchema = z.object({
    date: z.string().refine(
        (val) => !isNaN(new Date(val).getTime()),
        { message: "Invalid date format" }
    ),
    status: ReservationStatusEnum.optional(),
});

/**
 * Schema for checking reservation availability.
 */
export const CheckAvailabilitySchema = z.object({
    date: z.string().refine(
        (val) => !isNaN(new Date(val).getTime()),
        { message: "Invalid date format" }
    ),
    timeSlot: z
        .string()
        .regex(TIME_SLOT_REGEX, "Time slot must be in HH:MM format"),
});

// ─── Inferred Types ───

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;
export type ReservationFilter = z.infer<typeof ReservationFilterSchema>;
export type CheckAvailabilityInput = z.infer<typeof CheckAvailabilitySchema>;
export type ReservationStatus = z.infer<typeof ReservationStatusEnum>;
