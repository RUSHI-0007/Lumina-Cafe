"use client";

import { useState, useTransition } from "react";
import { updateAdminReservationStatus } from "@/app/actions/admin.actions";
import { Check, X, Users, Wine, CalendarDays } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const EVENT_TABS = [
    { key: "ALL", label: "All" },
    { key: "STANDARD", label: "Standard" },
    { key: "TASTING_ROOM", label: "Tasting Room" },
] as const;

const STATUS_BADGE: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    CONFIRMED: "bg-green-500/10 text-green-400 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    NO_SHOW: "bg-white/5 text-white/30 border-white/10",
};

export default function ReservationsDesk({ reservations: initial }: { reservations: any[] }) {
    const [reservations, setReservations] = useState(initial);
    const [activeTab, setActiveTab] = useState<string>("ALL");
    const [isPending, startTransition] = useTransition();

    const filtered = activeTab === "ALL"
        ? reservations
        : reservations.filter((r) => r.eventType === activeTab);

    function handleStatus(id: string, status: "CONFIRMED" | "CANCELLED") {
        // Optimistic
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status } : r))
        );

        startTransition(async () => {
            await updateAdminReservationStatus(id, status);
        });
    }

    return (
        <div className="space-y-6">
            {/* Event Type Tabs */}
            <div className="inline-flex bg-white/5 rounded-xl p-1 gap-1 border border-white/5">
                {EVENT_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${activeTab === tab.key
                                ? "bg-white/10 text-white"
                                : "text-white/40 hover:text-white/60"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reservation Cards */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-white/20 font-mono text-xs uppercase tracking-widest">
                        No reservations found
                    </div>
                ) : (
                    filtered.map((res) => {
                        const date = new Date(res.date);
                        const isPendingStatus = res.status === "PENDING";

                        return (
                            <div
                                key={res.id}
                                className="bg-[#141414] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-colors flex items-center gap-6"
                            >
                                {/* Date Block */}
                                <div className="shrink-0 w-16 h-16 bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/5">
                                    <span className="text-[10px] font-mono text-white/30 uppercase">
                                        {date.toLocaleDateString("en-US", { month: "short" })}
                                    </span>
                                    <span className="text-xl font-bold text-white leading-none">
                                        {date.getDate()}
                                    </span>
                                </div>

                                {/* Guest Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-medium text-sm text-white truncate">{res.guestName}</span>
                                        {res.eventType === "TASTING_ROOM" && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-mono rounded-full border border-purple-500/20">
                                                <Wine size={10} /> Tasting
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                                        <span className="flex items-center gap-1"><CalendarDays size={11} /> {res.timeSlot}</span>
                                        <span className="flex items-center gap-1"><Users size={11} /> {res.partySize} guests</span>
                                        <span>{res.guestEmail}</span>
                                    </div>
                                    {res.specialRequests && (
                                        <div className="mt-2 text-xs text-white/25 italic truncate max-w-md">
                                            "{res.specialRequests}"
                                        </div>
                                    )}
                                </div>

                                {/* Status + Actions */}
                                <div className="shrink-0 flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider ${STATUS_BADGE[res.status] || STATUS_BADGE.PENDING}`}>
                                        {res.status}
                                    </span>

                                    {isPendingStatus && (
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleStatus(res.id, "CONFIRMED")}
                                                disabled={isPending}
                                                title="Confirm"
                                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleStatus(res.id, "CANCELLED")}
                                                disabled={isPending}
                                                title="Cancel"
                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
