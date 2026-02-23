import { getOrCreateUser } from "@/app/actions/user.actions";
import { redirect } from "next/navigation";
import FastPassCard from "@/components/dashboard/fast-pass-card";
import SubscriptionCard from "@/components/dashboard/subscription-card";
import TastingReserveCard from "@/components/dashboard/tasting-reserve-card";
import RewardsCard from "@/components/dashboard/rewards-card";

export default async function DashboardPage() {
    const user = await getOrCreateUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Find the user's favorite order or fallback to the most recent one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawOrder = user.orders.find((o: any) => o.isFavorite) || user.orders[0] || null;

    // Serialize Decimals for the client component boundary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentOrder = rawOrder ? {
        ...rawOrder,
        totalAmount: Number(rawOrder.totalAmount),
        createdAt: rawOrder.createdAt instanceof Date ? rawOrder.createdAt.toISOString() : rawOrder.createdAt,
        updatedAt: rawOrder.updatedAt instanceof Date ? rawOrder.updatedAt.toISOString() : rawOrder.updatedAt,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: rawOrder.items.map((item: any) => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            product: item.product ? {
                ...item.product,
                price: item.product.price !== undefined ? Number(item.product.price) : undefined,
            } : item.product,
        })),
    } : null;
    const currentSubscription = user.subscriptions[0]?.frequency || null;

    return (
        <div className="space-y-12">
            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-sans font-bold text-charcoal tracking-tight mb-2 text-balance">
                    Welcome back, {user.name ? user.name.split(" ")[0] : "Guest"}.
                </h1>
                <p className="font-mono text-charcoal/60 uppercase tracking-widest text-sm">
                    Your Lumina Preferences & History
                </p>
            </header>

            {/* Bento Box Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[28rem]">
                {/* Top Left: Fast Pass */}
                <div className="col-span-1">
                    <FastPassCard recentOrder={recentOrder} />
                </div>

                {/* Top Right: Subscription */}
                <div className="col-span-1">
                    <SubscriptionCard currentFrequency={currentSubscription} />
                </div>

                {/* Bottom Left: Reserve */}
                <div className="col-span-1">
                    <TastingReserveCard />
                </div>

                {/* Bottom Right: Loyalty */}
                <div className="col-span-1">
                    <RewardsCard points={user.loyaltyPoints} />
                </div>
            </div>
        </div>
    );
}
