import { TrendingUp, ShoppingBag, DollarSign } from "lucide-react";

interface AdminInsightsProps {
    totalOrders: number;
    totalRevenue: number;
    activeReservations: number;
}

export function AdminInsights({ totalOrders, totalRevenue, activeReservations }: AdminInsightsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Orders Card */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-sage/5 rounded-full blur-2xl group-hover:bg-sage/10 transition-colors" />
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Total Orders</p>
                        <h3 className="text-3xl font-serif text-white">{totalOrders}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-sage">
                        <ShoppingBag size={18} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-sage/80 bg-sage/10 w-fit px-2 py-1 rounded-md">
                    <TrendingUp size={12} />
                    <span>+12% vs last week</span>
                </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-rust/5 rounded-full blur-2xl group-hover:bg-rust/10 transition-colors" />
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Gross Revenue</p>
                        <h3 className="text-3xl font-serif text-white">${totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-rust/10 flex items-center justify-center text-rust">
                        <DollarSign size={18} />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-rust/80 bg-rust/10 w-fit px-2 py-1 rounded-md">
                    <TrendingUp size={12} />
                    <span>+8.4% vs last week</span>
                </div>
            </div>

            {/* Active Reservations Card */}
            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Upcoming Tables</p>
                        <h3 className="text-3xl font-serif text-white">{activeReservations}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                        <span className="font-serif italic text-lg leading-none">R</span>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-white/60 bg-white/5 w-fit px-2 py-1 rounded-md border border-white/10">
                    <span>Next seating perfectly paced</span>
                </div>
            </div>
        </div>
    );
}
