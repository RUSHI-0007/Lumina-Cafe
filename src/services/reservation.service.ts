/**
 * Reservation Service
 *
 * Domain logic for table/tasting room bookings.
 * Handles availability checking, booking creation, and calendar queries.
 *
 * @module services/reservation.service
 */

import { prisma } from "@/lib/db/prisma";
import { withDb, type Result } from "@/lib/db/errors";
import type { CreateReservationInput } from "@/types/reservation";

/** Maximum reservations per time slot */
const MAX_RESERVATIONS_PER_SLOT = 8;

/** Maximum total guests per time slot */
const MAX_GUESTS_PER_SLOT = 30;

/**
 * Create a new reservation.
 *
 * Validates availability before creating the booking.
 * Throws if the time slot is fully booked.
 *
 * @param data - Validated reservation data
 * @returns The created reservation
 */
export async function createReservation(
    data: CreateReservationInput
): Promise<Result<unknown>> {
    return withDb(async () => {
        // Check availability first
        const existingReservations = await prisma.reservation.findMany({
            where: {
                date: new Date(data.date),
                timeSlot: data.timeSlot,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });

        if (existingReservations.length >= MAX_RESERVATIONS_PER_SLOT) {
            throw new Error(
                `The ${data.timeSlot} time slot on ${data.date} is fully booked.`
            );
        }

        const currentGuests = existingReservations.reduce(
            (sum: number, r: { partySize: number }) => sum + r.partySize,
            0
        );
        if (currentGuests + data.partySize > MAX_GUESTS_PER_SLOT) {
            throw new Error(
                `Not enough capacity for a party of ${data.partySize} at ${data.timeSlot} on ${data.date}. ` +
                `Only ${MAX_GUESTS_PER_SLOT - currentGuests} spots remaining.`
            );
        }

        return prisma.reservation.create({
            data: {
                guestName: data.guestName,
                guestEmail: data.guestEmail,
                guestPhone: data.guestPhone ?? null,
                partySize: data.partySize,
                date: new Date(data.date),
                timeSlot: data.timeSlot,
                specialRequests: data.specialRequests ?? null,
            },
        });
    });
}

/**
 * Fetch reservations for a specific date.
 *
 * @param date - The date to query (ISO string or Date)
 * @returns List of reservations for that date, sorted by time slot
 */
export async function getReservationsByDate(
    date: Date
): Promise<Result<unknown[]>> {
    return withDb(() =>
        prisma.reservation.findMany({
            where: {
                date: {
                    gte: new Date(date.toISOString().split("T")[0]),
                    lt: new Date(
                        new Date(date).setDate(date.getDate() + 1)
                    ),
                },
            },
            orderBy: { timeSlot: "asc" },
        })
    );
}

/**
 * Update the status of a reservation.
 *
 * @param id - Reservation CUID
 * @param status - New reservation status
 * @returns The updated reservation
 */
export async function updateReservationStatus(
    id: string,
    status: string
): Promise<Result<unknown>> {
    return withDb(() =>
        prisma.reservation.update({
            where: { id },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: { status: status as any },
        })
    );
}

/**
 * Check availability for a given date and time slot.
 *
 * @param date - The date to check (ISO string)
 * @param timeSlot - The time slot to check (e.g., "14:00")
 * @returns Availability status with remaining slot count
 */
export async function checkAvailability(
    date: string,
    timeSlot: string
): Promise<Result<{ available: boolean; remainingSlots: number; remainingGuests: number }>> {
    return withDb(async () => {
        const reservations = await prisma.reservation.findMany({
            where: {
                date: new Date(date),
                timeSlot,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });

        const currentGuests = reservations.reduce(
            (sum: number, r: { partySize: number }) => sum + r.partySize,
            0
        );

        return {
            available:
                reservations.length < MAX_RESERVATIONS_PER_SLOT &&
                currentGuests < MAX_GUESTS_PER_SLOT,
            remainingSlots: MAX_RESERVATIONS_PER_SLOT - reservations.length,
            remainingGuests: MAX_GUESTS_PER_SLOT - currentGuests,
        };
    });
}
