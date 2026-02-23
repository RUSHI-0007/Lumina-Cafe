import { prisma } from "@/lib/db/prisma";
import OrderBoard from "@/components/admin/order-board";
import { AdminInsights } from "@/components/admin/admin-insights";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: today } },
        include: {
            items: {
                include: {
                    product: { select: { id: true, name: true, imageUrl: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Fetch active reservations for today
    const reservationsCount = await prisma.reservation.count({
        where: {
            date: { gte: today },
            status: { in: ["PENDING", "CONFIRMED"] }
        }
    });

    // Calculate Insights
    const totalOrdersCount = orders.length;
    // Calculate revenue from PAID, PREPARING, READY, COMPLETED orders (exclude PENDING/CANCELLED)
    const validRevenueStatuses = ["PAID", "PREPARING", "READY", "COMPLETED"];
    const totalRevenue = orders
        .filter(o => validRevenueStatuses.includes(o.status))
        .reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // Serialize Decimals for the client component
    const serializedOrders = orders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
            ...item,
            unitPrice: Number(item.unitPrice),
        })),
    }));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Live Order Board</h1>
                <p className="font-mono text-sm text-white/40 mt-1 uppercase tracking-widest">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            <AdminInsights
                totalOrders={totalOrdersCount}
                totalRevenue={totalRevenue}
                activeReservations={reservationsCount}
            />

            <OrderBoard orders={serializedOrders} />
        </div>
    );
}
