"use client";

import { useState, useRef, useEffect } from "react";
import { Coffee } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function RewardsCard({ points }: { points: number }) {
    // Cap at 10 for visual, reset locally if desired over 10 points
    const activeCups = points % 10;
    const targetReached = activeCups === 9; // Let's say 10th cup is free, so having 9 means next is free.
    const isFree = points > 0 && points % 10 === 0;

    const [cups, setCups] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Animate the fill effect on mount
    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            if (current < (isFree ? 10 : activeCups)) {
                current++;
                setCups(current);
            } else {
                clearInterval(interval);
            }
        }, 150);
        return () => clearInterval(interval);
    }, [activeCups, isFree]);

    useGSAP(
        () => {
            // Small pulse on the grid
            gsap.fromTo(
                ".cup-grid",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
            );

            // Highlight target reached
            if (isFree) {
                gsap.to(".reward-alert", {
                    scale: 1.05,
                    color: "#CC5833",
                    duration: 0.8,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut"
                });
            }
        },
        { scope: containerRef, dependencies: [isFree] }
    );

    return (
        <div
            ref={containerRef}
            className="bg-[#2E4036] text-cream rounded-[2rem] p-8 shadow-lg tactile-hover h-full flex flex-col border border-white/5 relative bg-noise"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold font-sans">Lumina Rewards</h3>
                <div className="w-10 h-10 rounded-full border border-cream/20 flex flex-col items-center justify-center bg-white/5 shrink-0">
                    <span className="font-mono text-xs font-bold text-clay leading-none">{points}</span>
                    <span className="text-[8px] uppercase tracking-tighter opacity-70">Pts</span>
                </div>
            </div>

            {isFree ? (
                <p className="text-sm font-mono opacity-100 mt-1 reward-alert font-bold">
                    Free Reserve Pour Over unlocked!
                </p>
            ) : (
                <p className="text-sm font-mono opacity-80 mt-1">
                    <span className="font-bold text-clay">
                        {cups}/10 Coffees
                    </span>{" "}
                    — You are {10 - cups} away from a reward.
                </p>
            )}

            <div className="flex-1 flex flex-col justify-center my-8 cup-grid">
                <div className="grid grid-cols-5 gap-y-6 gap-x-4">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const isFilled = i < cups;
                        const isNinth = i === 9; // Highlight the 10th cup position as the goal
                        return (
                            <div
                                key={i}
                                className={`
                  aspect-square rounded-xl flex items-center justify-center transition-all duration-300
                  ${isFilled && !isFree ? "bg-cream text-moss" : ""}
                  ${!isFilled && !isNinth && !isFree ? "bg-black/20 text-cream/20" : ""}
                  ${isNinth && !isFilled ? "border-2 border-clay/50 border-dashed text-clay/50 bg-transparent" : ""}
                  ${isFree && isFilled ? "bg-clay text-cream shadow-[0_0_15px_rgba(204,88,51,0.5)] scale-110 z-10" : ""}
                `}
                            >
                                <Coffee size={24} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-xs font-mono text-white/50 uppercase tracking-widest mt-auto border-t border-cream/10 pt-4 text-center">
                Automatically tracks with app orders.
            </div>
        </div>
    );
}
