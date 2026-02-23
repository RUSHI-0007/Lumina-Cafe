"use client";

import { useState, useTransition } from "react";
import { toggleSoldOut } from "@/app/actions/admin.actions";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CATEGORY_LABELS: Record<string, string> = {
    ESPRESSO: "Espresso",
    POUR_OVER: "Pour Over",
    COLD_BREW: "Cold Brew",
    PASTRY: "Pastry",
    SEASONAL: "Seasonal",
    MERCHANDISE: "Merchandise",
};

export default function MenuTable({ products: initial }: { products: any[] }) {
    const [products, setProducts] = useState(initial);
    const [isPending, startTransition] = useTransition();

    function handleToggle(id: string, currentSoldOut: boolean) {
        // Optimistic
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isSoldOut: !currentSoldOut } : p))
        );

        startTransition(async () => {
            await toggleSoldOut(id, !currentSoldOut);
        });
    }

    return (
        <div className="bg-[#141414] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="px-5 py-3.5 text-[10px] font-mono uppercase tracking-widest text-white/30 font-medium">Product</th>
                        <th className="px-5 py-3.5 text-[10px] font-mono uppercase tracking-widest text-white/30 font-medium">Category</th>
                        <th className="px-5 py-3.5 text-[10px] font-mono uppercase tracking-widest text-white/30 font-medium text-right">Price</th>
                        <th className="px-5 py-3.5 text-[10px] font-mono uppercase tracking-widest text-white/30 font-medium text-center">Featured</th>
                        <th className="px-5 py-3.5 text-[10px] font-mono uppercase tracking-widest text-white/30 font-medium text-center">Availability</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${product.isSoldOut ? "opacity-50" : ""}`}
                        >
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover border border-white/10" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5" />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-white">{product.name}</div>
                                        <div className="text-xs text-white/30 truncate max-w-[200px]">{product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <span className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono text-white/50 uppercase tracking-wider">
                                    {CATEGORY_LABELS[product.category] || product.category}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                                <span className="font-mono text-sm text-white/70">${product.price.toFixed(2)}</span>
                            </td>
                            <td className="px-5 py-4 text-center">
                                {product.isFeatured && (
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-clay/20 text-clay text-[10px] font-mono font-bold uppercase">
                                        ★
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4 text-center">
                                <button
                                    onClick={() => handleToggle(product.id, product.isSoldOut)}
                                    disabled={isPending}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${product.isSoldOut
                                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                            : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                                        }`}
                                >
                                    {product.isSoldOut ? "Sold Out" : "In Stock"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
