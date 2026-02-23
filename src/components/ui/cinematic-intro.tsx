'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface DropletData {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    tgtX: number;
    tgtY: number;
    tgtRot: number;
    tgtScale: number;
}

export default function CinematicIntro() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const cubeRef = useRef<HTMLDivElement>(null);
    const splashGroupRef = useRef<HTMLDivElement>(null);

    const [dropletData, setDropletData] = useState<DropletData[]>([]);

    useEffect(() => {
        // Generate 45 particles (mixture of splashes and small liquid droplets)
        const particles = [...Array(45)].map(() => {
            const isSmall = Math.random() > 0.4;
            return {
                cx: 100,
                cy: 85,
                rx: isSmall ? gsap.utils.random(1, 4) : gsap.utils.random(4, 8),
                ry: isSmall ? gsap.utils.random(2, 6) : gsap.utils.random(6, 12),
                tgtX: gsap.utils.random(-250, 250),
                tgtY: gsap.utils.random(-300, -50),
                tgtRot: gsap.utils.random(-180, 180),
                tgtScale: gsap.utils.random(0.3, 1.2),
            };
        });
        requestAnimationFrame(() => {
            setDropletData(particles);
        });
    }, []);

    useGSAP(
        () => {
            if (dropletData.length === 0) return; // Wait for hydration

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=1500',
                    pin: true,
                    scrub: 0.5, // Smoother scrub
                },
            });

            // Initial states (avoiding heavy filters for mobile perf)
            gsap.set(cubeRef.current, { y: -450, rotation: 25, scale: 1.2 });
            gsap.set('.droplet', { scale: 0, autoAlpha: 0, x: 0, y: 0 });
            gsap.set('.crown', { scale: 0, autoAlpha: 0, transformOrigin: 'center bottom' });
            gsap.set(textRef.current, { y: 150, opacity: 0, scale: 0.85 });

            tl.to(cubeRef.current, {
                y: 0,
                rotation: -10,
                scale: 0.7,
                ease: 'power3.in',
                duration: 0.25,
            });

            tl.to(cubeRef.current, { autoAlpha: 0, duration: 0.05 }, '>');

            tl.add('splashIn', '-=0.05');

            // Fixed double spill: targeting all droplets array with function based values
            tl.to('.droplet', {
                scale: (i) => dropletData[i].tgtScale,
                autoAlpha: 1,
                x: (i) => dropletData[i].tgtX,
                y: (i) => dropletData[i].tgtY,
                rotation: (i) => dropletData[i].tgtRot,
                ease: 'power2.out',
                duration: 0.3,
            }, 'splashIn');

            tl.to('.crown', {
                scaleX: 1.5,
                scaleY: 2.5,
                autoAlpha: 0.85,
                ease: 'back.out(1.2)',
                duration: 0.25
            }, 'splashIn');

            tl.to(textRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: 'power3.out',
                duration: 0.4
            }, 'splashIn+=0.1');

            tl.add('splashOut', 'splashIn+=0.4');

            // Proper cleanup going down, no negative looping offsets that break GSAP
            tl.to('.droplet', {
                autoAlpha: 0,
                y: '+=100',
                scale: 0,
                duration: 0.25,
                ease: 'power1.inOut'
            }, 'splashOut');

            tl.to('.crown', { scaleY: 0, autoAlpha: 0, duration: 0.2 }, 'splashOut');

        },
        { scope: containerRef, dependencies: [dropletData] }
    );

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full bg-[#2A2421] flex items-center justify-center overflow-hidden z-20"
        >
            {/* Grainy Wall Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-overlay z-0">
                <svg width="100%" height="100%">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* Repositioned text to be centered between navbar and cup */}
            <div className="absolute inset-x-0 top-[25%] md:top-[22%] -translate-y-[50%] flex justify-center pointer-events-none z-10">
                <h1
                    ref={textRef}
                    className="text-[20vw] md:text-[min(22vw,300px)] font-drama italic text-[#DFD6CB] opacity-90 leading-none tracking-tight drop-shadow-lg"
                >
                    COFFEE
                </h1>
            </div>

            <div
                className="relative z-20 w-full max-w-[350px] aspect-square flex items-center justify-center mt-32 md:mt-48"
            >
                {/* Cube */}
                <div ref={cubeRef} className="absolute left-1/2 -translate-x-1/2 top-[-20%] w-14 h-14 z-30">
                    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                        <defs>
                            <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#FFFFFF" />
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
                        <path d="M5 15L25 5L45 15 M25 5V25 M5 35L25 45L45 35" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
                    </svg>
                </div>

                {/* Splash & Particles - Brightened to contrast with dark background */}
                <div ref={splashGroupRef} className="absolute inset-0 z-20 pointer-events-none">
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full scale-[1.3] overflow-visible">
                        <defs>
                            <radialGradient id="splashGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#7A4526" />
                                <stop offset="100%" stopColor="#3E1A0C" />
                            </radialGradient>
                            <linearGradient id="particleGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#A86A4A" />
                                <stop offset="100%" stopColor="#5E321A" />
                            </linearGradient>
                        </defs>
                        {dropletData.map((d, i) => (
                            <ellipse
                                key={i}
                                cx={d.cx}
                                cy={d.cy}
                                rx={d.rx}
                                ry={d.ry}
                                fill={i % 3 === 0 ? "url(#particleGrad)" : "url(#splashGrad)"}
                                className={`droplet droplet-${i}`}
                            />
                        ))}
                        <path
                            d="M100 85 Q 70 60, 40 85 Q 70 40, 100 65 Q 130 40, 160 85 Q 130 60, 100 85"
                            fill="url(#splashGrad)"
                            className="crown"
                        />
                    </svg>
                </div>

                {/* Cup */}
                <div className="absolute inset-0 z-40 pointer-events-none drop-shadow-2xl">
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                        <defs>
                            <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#C45A34" />
                                <stop offset="50%" stopColor="#E57A4D" />
                                <stop offset="100%" stopColor="#A83E1A" />
                            </linearGradient>
                            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4A2615" />
                                <stop offset="100%" stopColor="#241108" />
                            </linearGradient>
                            <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3A1F13" />
                                <stop offset="100%" stopColor="#1A0D08" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M140 95 C 185 90, 185 145, 135 140"
                            stroke="url(#cupGrad)"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />
                        <path d="M 45 80 L 58 150 C 65 168, 135 168, 142 150 L 155 80 Z" fill="url(#cupGrad)" />
                        <ellipse cx="100" cy="80" rx="55" ry="20" fill="url(#rimGrad)" />
                        <ellipse cx="100" cy="83" rx="51" ry="17" fill="url(#liquidGrad)" />
                        <ellipse cx="100" cy="80" rx="55" ry="20" fill="transparent" stroke="#F8B499" strokeWidth="1.5" opacity="0.6" />
                        <path
                            d="M 60 90 Q 65 140, 70 145"
                            stroke="#FFFFFF"
                            strokeWidth="5"
                            strokeLinecap="round"
                            opacity="0.2"
                            style={{ filter: 'blur(2px)' }}
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
}
