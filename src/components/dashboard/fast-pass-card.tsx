"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Coffee } from "lucide-react";
import { quickReorder } from "@/app/actions/user.actions";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function FastPassCard({ recentOrder }: { recentOrder: any }) {
    const [waitTime, setWaitTime] = useState(3);
    const [isOrdering, setIsOrdering] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setWaitTime(Math.floor(Math.random() * 4) + 2); // 2-5 mins
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useGSAP(
        () => {
            const btn = btnRef.current;
            if (!btn) return;
            const handleMouseMove = (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.2,
                    boxShadow: '0px 15px 30px rgba(0,0,0,0.1)',
                    scale: 1.02,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            };
            const handleMouseLeave = () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    boxShadow: '0px 4px 6px rgba(0,0,0,0.05)',
                    scale: 1,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)',
                });
            };

            btn.addEventListener('mousemove', handleMouseMove);
            btn.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                btn.removeEventListener('mousemove', handleMouseMove);
                btn.removeEventListener('mouseleave', handleMouseLeave);
            };
        },
        { scope: btnRef }
    );

    async function handleReorder() {
        setIsOrdering(true);
        const result = await quickReorder();
        setIsOrdering(false);
        if (result.success) {
            alert("Order placed successfully! Expected ready time: " + waitTime + " mins.");
        } else {
            alert("Failed to place order.");
        }
    }

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow duration-500 h-full flex flex-col border border-charcoal/5 relative overflow-hidden tactile-hover">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold font-sans text-charcoal">Fast Pass Queue</h3>
                    <p className="text-sm font-mono text-charcoal/50 mt-1">Skip the line.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-xs font-mono font-bold whitespace-nowrap">Wait: {waitTime} Min{waitTime !== 1 && "s"}</span>
                </div>
            </div>

            <div className="flex-1 mt-4 relative bg-[#F8F9FA] rounded-[1.5rem] p-5 border border-charcoal/5 flex flex-col justify-between overflow-hidden">
                <span className="text-xs font-mono uppercase tracking-widest text-charcoal/40 mb-2 block">Quick Reorder</span>

                {recentOrder ? (
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-16 h-16 bg-sage/20 rounded-xl flex items-center justify-center shrink-0">
                            {recentOrder.items[0]?.product?.imageUrl ? (
                                <img src={recentOrder.items[0].product.imageUrl} alt="Favorite drink" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <Coffee size={24} className="text-sage" />
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-charcoal truncate max-w-[200px]">
                                {recentOrder.items[0]?.product?.name || "Lumina Custom Build"}
                            </div>
                            <div className="text-sm text-charcoal/60">
                                {recentOrder.items.length > 1 ? `+ ${recentOrder.items.length - 1} more items` : "Standard preparation"}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 mt-2 opacity-50">
                        <div className="w-16 h-16 bg-sage/20 rounded-xl flex items-center justify-center shrink-0">
                            <Coffee size={24} className="text-sage" />
                        </div>
                        <div>
                            <div className="font-bold text-charcoal">No past orders</div>
                            <div className="text-sm text-charcoal/60">Order from the menu first</div>
                        </div>
                    </div>
                )}

                <button
                    ref={btnRef}
                    onClick={handleReorder}
                    disabled={!recentOrder || isOrdering}
                    className="mt-6 w-full bg-charcoal text-cream py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
                >
                    {isOrdering ? "Sending to Barista..." : (
                        <>Fire Order Now <ArrowRight size={16} /></>
                    )}
                </button>
            </div>
        </div>
    );
}
