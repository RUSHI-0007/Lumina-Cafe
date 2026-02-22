import React, { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicIntro() {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const cubeRef = useRef(null);
    const splashGroupRef = useRef(null);
    const cupGroupRef = useRef(null);

    // Pre-calculate random vectors for droplets so they remain stable on ScrollTrigger refresh
    const dropletData = useMemo(() => {
        return [...Array(20)].map(() => ({
            cx: 100,
            cy: 85,
            rx: gsap.utils.random(2, 6),
            ry: gsap.utils.random(4, 12),
            tgtX: gsap.utils.random(-160, 160),
            tgtY: gsap.utils.random(-220, -80),
            tgtRot: gsap.utils.random(-180, 180),
            tgtScale: gsap.utils.random(0.5, 1.5)
        }));
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=1200", // Shorter scroll distance = faster, snappier sequence
                pin: true,
                scrub: 0.3, // Lower scrub = much tighter/faster lock to scroll wheel
            }
        });

        // 1. Initial State
        // Sugar cube high up, scaled up slightly for 3D perspective
        gsap.set(cubeRef.current, { y: -450, rotation: 25, scale: 1.2 });

        // Splash items hidden
        gsap.set(".droplet", { scale: 0, autoAlpha: 0, x: 0, y: 0 });
        gsap.set(".crown", { scale: 0, autoAlpha: 0, transformOrigin: "center bottom" });

        // Text hidden, low, and blurred
        gsap.set(textRef.current, { y: 200, opacity: 0, scale: 0.85, filter: "blur(12px)" });

        // 2. The Drop (Scroll 0-25%)
        tl.to(cubeRef.current, {
            y: 0, // Hit the liquid surface
            rotation: -10,
            scale: 0.7, // Perspective shrinks as it moves away/down
            ease: "power4.in", // Gravity acceleration (very sharp drop)
            duration: 0.25
        });

        // 3. Impact (Instant)
        tl.to(cubeRef.current, {
            autoAlpha: 0,
            duration: 0.01 // Vaporize instantly
        }, ">");

        // 4. The Splash Explosion (Scroll 25-45%)
        // Explode droplets outwards
        dropletData.forEach((d, i) => {
            tl.to(`.droplet-${i}`, {
                scale: d.tgtScale,
                autoAlpha: 1,
                x: d.tgtX,
                y: d.tgtY,
                rotation: d.tgtRot,
                ease: "power2.out",
                duration: 0.2
            }, "<"); // All happen simultaneously with impact
        });

        // The central splash crown shoots up
        tl.to(".crown", {
            scaleX: 1.3,
            scaleY: 2.2,
            autoAlpha: 0.9,
            ease: "back.out(1.5)",
            duration: 0.2
        }, "<");

        // 5. The Mighty Reveal of "COFFEE" (Scroll 35-80%)
        // Start this slightly *before* the splash finishes expanding for violent overlap
        tl.to(textRef.current, {
            y: -150,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 0.45
        }, "<0.05");

        // 6. Splash Settling (Scroll 45-55%)
        // Droplets fall back and fade
        dropletData.forEach((d, i) => {
            tl.to(`.droplet-${i}`, {
                autoAlpha: 0,
                y: d.tgtY + 50, // Gravity pulls them down a bit
                scale: 0,
                duration: 0.1
            }, "-=0.25"); // Overlap with text reveal
        });

        // Crown collapses
        tl.to(".crown", {
            scaleY: 0,
            autoAlpha: 0,
            duration: 0.1
        }, "<");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-[#111] bg-noise flex items-center justify-center overflow-hidden z-20">
            {/* The Huge Rising Text */}
            <div className="absolute inset-x-0 top-[55%] -translate-y-[50%] flex justify-center pointer-events-none z-0">
                <h1 ref={textRef}
                    className="text-[20vw] md:text-[min(22vw,300px)] font-drama italic text-cream leading-none tracking-tight">
                    COFFEE
                </h1>
            </div>

            {/* The SVG Container */}
            <div ref={cupGroupRef} className="relative z-10 w-full max-w-[350px] aspect-square flex items-center justify-center mt-32 md:mt-48">

                {/* 1. High-Fidelity Sugar Cube */}
                <div ref={cubeRef} className="absolute left-1/2 -translate-x-1/2 top-[-20%] w-14 h-14 z-20">
                    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                        <defs>
                            <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#EAE8E3" />
                            </linearGradient>
                            <linearGradient id="cubeLeft" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#D8D6D0" />
                                <stop offset="100%" stopColor="#B5B3AD" />
                            </linearGradient>
                            <linearGradient id="cubeRight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C0BEB8" />
                                <stop offset="100%" stopColor="#96948F" />
                            </linearGradient>
                        </defs>
                        <path d="M25 5L45 15L25 25L5 15L25 5Z" fill="url(#cubeTop)" />
                        <path d="M5 15L25 25V45L5 35V15Z" fill="url(#cubeLeft)" />
                        <path d="M45 15L25 25V45L45 35V15Z" fill="url(#cubeRight)" />
                        {/* Shimmer/Edge highlights */}
                        <path d="M5 15L25 5L45 15 M25 5V25 M5 35L25 45L45 35" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
                    </svg>
                </div>

                {/* 2. Coffee Splash Particles */}
                <div ref={splashGroupRef} className="absolute inset-0 z-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full scale-[1.3] overflow-visible">
                        <defs>
                            <radialGradient id="splashGrad" cx="50%" cy="50%" r="50%">
                                {/* Dark, rich espresso colors */}
                                <stop offset="0%" stopColor="#4A2E24" />
                                <stop offset="100%" stopColor="#1C0F0A" />
                            </radialGradient>
                        </defs>
                        {/* Map the calculated droplets */}
                        {dropletData.map((d, i) => (
                            <ellipse
                                key={i}
                                cx={d.cx}
                                cy={d.cy}
                                rx={d.rx}
                                ry={d.ry}
                                fill="url(#splashGrad)"
                                className={`droplet droplet-${i} drop-shadow-md`}
                            />
                        ))}
                        {/* Main Splash Crown */}
                        <path d="M100 85 Q 70 60, 40 85 Q 70 40, 100 65 Q 130 40, 160 85 Q 130 60, 100 85" fill="url(#splashGrad)" className="crown drop-shadow-lg" />
                    </svg>
                </div>

                {/* 3. Realistic 3D Ceramic Coffee Cup */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                        <defs>
                            {/* Rich Ceramic Gradient */}
                            <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#A84322" />
                                <stop offset="50%" stopColor="#E26A42" />
                                <stop offset="100%" stopColor="#8A2F11" />
                            </linearGradient>
                            {/* Deep Espresso Liquid Gradient */}
                            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3E2214" />
                                <stop offset="100%" stopColor="#140A05" />
                            </linearGradient>
                            {/* Inner Rim Shadowing */}
                            <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2A1B14" />
                                <stop offset="100%" stopColor="#110A07" />
                            </linearGradient>
                        </defs>

                        {/* Soft Base Shadow */}
                        <ellipse cx="106" cy="155" rx="55" ry="15" fill="#000" opacity="0.6" filter="blur(6px)" />

                        {/* Thick Ceramic Handle */}
                        <path d="M140 95 C 185 90, 185 145, 135 140" stroke="url(#cupGrad)" strokeWidth="16" strokeLinecap="round" className="drop-shadow-md" />

                        {/* Glossy Cup Body */}
                        <path d="M 45 80 L 58 150 C 65 168, 135 168, 142 150 L 155 80 Z" fill="url(#cupGrad)" />

                        {/* Inner Cup Wall (Dark) */}
                        <ellipse cx="100" cy="80" rx="55" ry="20" fill="url(#rimGrad)" />

                        {/* Deep Coffee Liquid Level */}
                        <ellipse cx="100" cy="83" rx="51" ry="17" fill="url(#liquidGrad)" />

                        {/* Delicate Lip Highlight */}
                        <ellipse cx="100" cy="80" rx="55" ry="20" fill="transparent" stroke="#F6A385" strokeWidth="1.5" opacity="0.7" />

                        {/* Ceramic Gloss Reflection */}
                        <path d="M 60 90 Q 65 140, 70 145" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.15" filter="blur(2px)" />
                    </svg>
                </div>
            </div>
        </section>
    );
}

export default CinematicIntro;
