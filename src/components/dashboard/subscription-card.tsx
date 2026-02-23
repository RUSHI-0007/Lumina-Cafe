"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { updateSubscription } from "@/app/actions/user.actions";

export default function SubscriptionCard({ currentFrequency }: { currentFrequency: "WEEKLY" | "BI_WEEKLY" | "MONTHLY" | null }) {
    const [freq, setFreq] = useState<"WEEKLY" | "BI_WEEKLY" | "MONTHLY">(currentFrequency || "BI_WEEKLY");
    const [isUpdating, setIsUpdating] = useState(false);
    const frequencies = ["WEEKLY", "BI_WEEKLY", "MONTHLY"];
    const displayLabels: Record<string, string> = { WEEKLY: "Weekly", BI_WEEKLY: "Bi-Weekly", MONTHLY: "Monthly" };
    const priceRange: Record<string, number> = { WEEKLY: 16, BI_WEEKLY: 18, MONTHLY: 24 };

    const priceRef = useRef<HTMLSpanElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const newPrice = priceRange[freq];

            gsap.fromTo(
                priceRef.current,
                { innerHTML: priceRef.current?.innerText.replace("$", "") },
                {
                    innerHTML: newPrice,
                    duration: 0.8,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        if (priceRef.current) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const tween = this as any;
                            priceRef.current.innerHTML = "$" + Math.round(Number(tween.targets()[0].innerHTML));
                        }
                    },
                }
            );

            if (freq !== "MONTHLY") {
                gsap.to(badgeRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" });
            } else {
                gsap.to(badgeRef.current, { y: -10, opacity: 0, scale: 0.9, duration: 0.3 });
            }
        },
        { dependencies: [freq], scope: containerRef }
    );

    async function handleUpdate() {
        setIsUpdating(true);
        const result = await updateSubscription(freq);
        setIsUpdating(false);
        if (!result.success) {
            alert("Failed to update subscription. " + result.error);
        }
    }

    const isCurrentPlan = currentFrequency === freq;

    return (
        <div
            ref={containerRef}
            className="bg-[#1A1A1A] text-white rounded-[2rem] p-8 shadow-lg h-full flex flex-col border border-white/10 relative overflow-hidden tactile-hover"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold font-sans">The Roaster's Subscription</h3>
                    <p className="text-sm font-mono text-white/50 mt-1">Manage delivery frequency.</p>
                </div>
                <div
                    ref={badgeRef}
                    className="bg-clay/20 text-clay border border-clay/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap opacity-0 transform -translate-y-2 scale-90"
                >
                    Saves 15%
                </div>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl mb-8 relative">
                {frequencies.map((f) => {
                    const typedF = f as "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
                    return (
                        <button
                            key={f}
                            onClick={() => setFreq(typedF)}
                            className={`flex-1 text-center py-2.5 text-xs font-mono font-medium rounded-lg transition-all duration-300 z-10 ${freq === f ? "text-charcoal" : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            {displayLabels[f]}
                        </button>
                    );
                })}
                <div
                    className="absolute top-1 bottom-1 bg-cream rounded-lg shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                    style={{
                        width: `calc(33.333% - 5px)`,
                        transform: `translateX(${frequencies.indexOf(freq) * 100}%) translateX(${frequencies.indexOf(freq) * 4}px)`,
                    }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-sm font-mono text-white/40 mb-2 uppercase tracking-widest">
                    {isCurrentPlan ? "Active Plan" : "Starting at"}
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                    <span ref={priceRef} className="text-7xl font-sans font-light tracking-tight tabular-nums">
                        ${priceRange[currentFrequency || "BI_WEEKLY"]}
                    </span>
                    <span className="text-xl font-mono text-white/30">/bag</span>
                </div>
                <div className="text-sm text-white/60 mt-4 font-mono text-center max-w-[200px]">
                    {isCurrentPlan ? "We'll fulfill your next order automatically." : "Change to modify your upcoming deliveries."}
                </div>
            </div>

            <button
                onClick={handleUpdate}
                disabled={isCurrentPlan || isUpdating}
                className="mt-6 w-full bg-clay text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-colors hover:bg-clay/90 disabled:opacity-50 disabled:bg-white/10 disabled:text-white/50"
            >
                {isUpdating ? "Updating..." : isCurrentPlan ? "Current Plan" : "Update Plan"}
            </button>
        </div>
    );
}
