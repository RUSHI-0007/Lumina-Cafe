"use client";

import { useState, useTransition } from "react";
import { updateAdminOrderStatus } from "@/app/actions/admin.actions";
import { Clock, ChefHat, CheckCircle, ArrowRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface OrderBoardProps {
    orders: any[];
}

const STATUS_COLUMNS = [
    { key: "PENDING", label: "Pending", icon: <Clock size={16} />, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    { key: "PREPARING", label: "Preparing", icon: <ChefHat size={16} />, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { key: "COMPLETED", label: "Completed", icon: <CheckCircle size={16} />, color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

const NEXT_STATUS: Record<string, string> = {
    PENDING: "PREPARING",
    PREPARING: "COMPLETED",
};

export default function OrderBoard({ orders: initialOrders }: OrderBoardProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [isPending, startTransition] = useTransition();

    function handleAdvance(orderId: string, currentStatus: string) {
        const nextStatus = NEXT_STATUS[currentStatus];
        if (!nextStatus) return;

        // Optimistic update
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );

        startTransition(async () => {
            await updateAdminOrderStatus(orderId, { status: nextStatus });
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {STATUS_COLUMNS.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.key);
                return (
                    <div key={col.key} className="space-y-4">
                        {/* Column Header */}
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${col.color} text-sm font-mono font-bold uppercase tracking-wider`}>
                            {col.icon}
                            {col.label}
                            <span className="ml-auto text-xs opacity-60">{colOrders.length}</span>
                        </div>

                        {/* Order Cards */}
                        <div className="space-y-3">
                            {colOrders.length === 0 ? (
                                <div className="text-center py-12 text-white/20 font-mono text-xs uppercase tracking-widest">
                                    No orders
                                </div>
                            ) : (
                                colOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-[#1A1A1A] rounded-xl border border-white/5 p-4 hover:border-white/10 transition-colors"
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="font-medium text-sm text-white">{order.customerName}</div>
                                                <div className="font-mono text-[10px] text-white/30 mt-0.5">
                                                    {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                </div>
                                            </div>
                                            <div className="font-mono text-sm font-bold text-clay">${order.totalAmount.toFixed(2)}</div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-1.5 mb-4">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center text-xs">
                                                    <span className="text-white/60">
                                                        <span className="text-white/30 mr-1.5">{item.quantity}×</span>
                                                        {item.product?.name || "Unknown"}
                                                    </span>
                                                    <span className="font-mono text-white/30">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action */}
                                        {NEXT_STATUS[order.status] && (
                                            <button
                                                onClick={() => handleAdvance(order.id, order.status)}
                                                disabled={isPending}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-all disabled:opacity-50"
                                            >
                                                Move to {NEXT_STATUS[order.status]}
                                                <ArrowRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
