import { prisma } from "@/lib/db/prisma";
import ReservationsDesk from "@/components/admin/reservations-desk";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservations = await prisma.reservation.findMany({
        where: { date: { gte: today } },
        orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    });

    const serialized = reservations.map((r) => ({
        ...r,
        date: r.date instanceof Date && !isNaN(r.date.getTime()) ? r.date.toISOString() : new Date().toISOString(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Reservations Desk</h1>
                <p className="font-mono text-sm text-white/40 mt-1 uppercase tracking-widest">
                    {serialized.length} upcoming bookings
                </p>
            </div>
            <ReservationsDesk reservations={serialized} />
        </div>
    );
}
