"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TastingReserveCard() {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Mock calendar data
    const dates = [12, 13, 14, 15, 16, 17, 18];
    const availableSlots = [14, 16];

    useGSAP(
        () => {
            if (selectedDate) {
                gsap.to(drawerRef.current, {
                    height: "auto",
                    opacity: 1,
                    marginTop: 16,
                    paddingTop: 16,
                    duration: 0.5,
                    ease: "power3.out",
                });
            } else {
                gsap.to(drawerRef.current, {
                    height: 0,
                    opacity: 0,
                    marginTop: 0,
                    paddingTop: 0,
                    duration: 0.3,
                    ease: "power2.in",
                });
            }
        },
        { dependencies: [selectedDate], scope: containerRef }
    );

    return (
        <div
            ref={containerRef}
            className="bg-cream rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow duration-500 h-full flex flex-col border border-charcoal/5 relative overflow-hidden tactile-hover"
        >
            <div>
                <h3 className="text-xl font-bold font-sans text-charcoal">Tasting Room Booking</h3>
                <p className="text-sm font-mono opacity-60 mt-1">Exclusive weekend cuppings</p>
            </div>

            <div className="mt-8 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-6 px-2 text-xs font-mono opacity-50 uppercase tracking-widest">
                    <span>This Week</span>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-moss/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-moss/50" />
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-6 gap-x-2 px-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={"day-" + i} className="text-center text-xs font-mono opacity-30 font-bold mb-2">
                            {d}
                        </div>
                    ))}
                    {dates.map((date) => {
                        const isAvailable = availableSlots.includes(date);
                        const isSelected = selectedDate === date;
                        return (
                            <button
                                key={"date-" + date}
                                onClick={() => (isAvailable ? setSelectedDate(isSelected ? null : date) : null)}
                                className={`
                  aspect-square w-full rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${!isAvailable ? "opacity-20 cursor-not-allowed hidden md:flex" : ""}
                  ${isAvailable && !isSelected ? "bg-moss/10 text-moss hover:bg-moss/20 hover:scale-105 hover:shadow-md cursor-pointer" : ""}
                  ${isSelected ? "bg-moss text-cream scale-105 shadow-md" : ""}
                `}
                            >
                                {date}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div
                ref={drawerRef}
                className="h-0 opacity-0 overflow-hidden border-t border-charcoal/10 flex flex-col shrink-0"
            >
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-charcoal/60">
                        Head Roaster Session
                    </span>
                    <span className="text-xs font-bold text-clay mt-0.5">2 Seats Left</span>
                </div>
                <button
                    onClick={() => alert("Redirecting to reservation flow...")}
                    className="w-full bg-charcoal text-cream py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-black transition-colors shrink-0"
                >
                    Secure Spot — $45
                </button>
            </div>
        </div>
    );
}
