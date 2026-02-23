/**
 * Reservation Server Actions
 *
 * Server actions for booking tables/tasting rooms and checking availability.
 * All input is validated with Zod before processing.
 *
 * @module actions/reservation
 */

"use server";

import {
    CreateReservationSchema,
    CheckAvailabilitySchema,
} from "@/types/reservation";
import {
    createReservation,
    checkAvailability,
} from "@/services/reservation.service";

/**
 * Book a table or tasting room.
 *
 * Validates guest details, party size, and date/time format.
 * Checks availability before confirming the reservation.
 *
 * @param formData - Raw reservation data from the client
 */
export async function bookTable(formData: unknown) {
    const parsed = CreateReservationSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
        };
    }

    return createReservation(parsed.data);
}

/**
 * Check if a specific date/time slot has availability.
 *
 * @param formData - Object with `date` (ISO string) and `timeSlot` (HH:MM)
 */
export async function checkTableAvailability(formData: unknown) {
    const parsed = CheckAvailabilitySchema.safeParse(formData);

    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((e: { message: string }) => e.message).join(", "),
        };
    }

    return checkAvailability(parsed.data.date, parsed.data.timeSlot);
}
