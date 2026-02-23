'use client';

/**
 * PageClient — Client Component Wrapper
 *
 * Contains all the animated sections that require client-side rendering
 * (GSAP, useState, useEffect, useRef). Imported by the server-component page.
 *
 * @module components/page-client
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Coffee, ShoppingBag } from 'lucide-react';

import { useCartStore } from '@/lib/store/cart';

import RevealLoader from '@/components/ui/reveal-loader';
import TestimonialsCard from '@/components/ui/testimonials-card';
import SocialFlipButton from '@/components/ui/social-flip-button';
import CinematicIntro from '@/components/ui/cinematic-intro';
import { HowItWorks } from './how-it-works';
import { AboutUs } from './about-us';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Navbar ───

function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const { setIsOpen, items } = useCartStore();

    useGSAP(() => {
        ScrollTrigger.create({
            start: 'top -50',
            end: 99999,
            onUpdate: (self) => {
                if (self.direction === 1 && self.progress > 0) {
                    gsap.to(navRef.current, {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(24px)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#1A1A1A',
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                } else if (self.progress === 0 || (self.direction === -1 && self.scroll() < 50)) {
                    gsap.to(navRef.current, {
                        backgroundColor: 'transparent',
                        backdropFilter: 'blur(0px)',
                        borderColor: 'transparent',
                        color: '#ffffff',
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                }
            },
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-full px-6 py-4 flex justify-between items-center transition-colors text-white border border-transparent"
        >
            <div className="font-bold text-xl tracking-tight">Lumina Café</div>
            <div className="hidden md:flex gap-8 font-medium">
                <a href="#features" className="hover:-translate-y-[1px] transition-transform">
                    Origins
                </a>
                <a href="#menu" className="hover:-translate-y-[1px] transition-transform">
                    Menu
                </a>
                <a href="#philosophy" className="hover:-translate-y-[1px] transition-transform">
                    Philosophy
                </a>
                <a href="#reserve" className="hover:-translate-y-[1px] transition-transform">
                    Reserve
                </a>
            </div>
            <button onClick={() => setIsOpen(true)} className="bg-clay text-white px-6 py-2 rounded-full font-medium flex items-center justify-center gap-2 magnetic-btn">
                <ShoppingBag size={18} />
                Order Ahead
                {items.length > 0 && (
                    <span className="bg-cream text-charcoal text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                        {items.length}
                    </span>
                )}
            </button>
        </nav>
    );
}

// ─── Hero ───

function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const { setIsOpen } = useCartStore();
    const bgRef = useRef<HTMLImageElement>(null);
    const textRefs = useRef<(HTMLElement | null)[]>([]);

    useGSAP(
        () => {
            gsap.fromTo(bgRef.current, { scale: 1.1 }, { scale: 1, duration: 4, ease: 'power2.out' });

            gsap.fromTo(
                textRefs.current,
                { y: 30, opacity: 0, filter: 'blur(10px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
            );
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="relative h-[100dvh] w-full overflow-hidden flex items-end pb-24 px-8 md:px-16"
        >
            <div className="absolute inset-0 bg-charcoal">
                <img
                    ref={bgRef}
                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop"
                    alt="Macro espresso extraction"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
            </div>
            <div className="relative z-10 w-full max-w-5xl text-cream">
                <h1 className="flex flex-col gap-2">
                    <span
                        ref={(el) => { textRefs.current[0] = el; }}
                        className="text-2xl md:text-4xl font-sans font-bold tracking-tight"
                    >
                        Artisanal extraction is the
                    </span>
                    <span
                        ref={(el) => { textRefs.current[1] = el; }}
                        className="text-6xl md:text-9xl font-drama italic font-light leading-none"
                    >
                        Standard.
                    </span>
                </h1>
                <p
                    ref={(el) => { textRefs.current[2] = el; }}
                    className="mt-8 text-lg md:text-xl font-mono text-cream/80 max-w-lg"
                >
                    Ethically sourced single-origin beans. Masterfully extracted espresso. Warm, architecturally stunning spaces.
                </p>
                <div ref={(el) => { textRefs.current[3] = el; }} className="mt-12 w-fit">
                    <button onClick={() => setIsOpen(true)} className="bg-clay text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 magnetic-btn text-lg tactile-hover">
                        Order Ahead <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}

// ─── Interactive Feature Cards ───

function QueueCard() {
    const [waitTime, setWaitTime] = useState(4);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setWaitTime(Math.floor(Math.random() * 4) + 3);
        }, 4000);
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
                    x: x * 0.3,
                    y: y * 0.3,
                    boxShadow: '0px 20px 40px rgba(0,0,0,0.15)',
                    scale: 1.05,
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
                    ease: 'elastic.out(1, 0.3)',
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

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow duration-500 h-[26rem] flex flex-col border border-charcoal/5 relative overflow-hidden tactile-hover">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold font-sans">Live Queue &amp; Fast Pass</h3>
                    <p className="text-sm font-mono opacity-60 mt-1">Skip the line. Ready when you arrive.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-xs font-mono font-bold">Wait: {waitTime} Mins</span>
                </div>
            </div>

            <div className="flex-1 mt-4 relative bg-[#F8F9FA] rounded-xl p-4 border border-charcoal/5 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-widest opacity-40">One-Tap Reorder</span>
                <div className="flex items-center gap-4 mt-2">
                    <img
                        src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=200&auto=format&fit=crop"
                        alt="Iced Oat Cortado"
                        className="w-16 h-16 rounded-lg object-cover shadow-sm"
                    />
                    <div>
                        <div className="font-bold text-charcoal">Iced Oat Cortado</div>
                        <div className="text-sm opacity-60">Extra shot, light ice</div>
                    </div>
                </div>
                <button
                    ref={btnRef}
                    className="mt-4 w-full bg-charcoal text-cream py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-all origin-center z-10 flex-shrink-0"
                >
                    Quick Order <ArrowRight size={16} />
                </button>
            </div>

            <div className="mt-4 text-[10px] font-mono opacity-40 uppercase tracking-widest text-center w-full">
                Used by 124 regulars this week.
            </div>
        </div>
    );
}

function SubscriptionCard() {
    const [freq, setFreq] = useState('Bi-Weekly');
    const frequencies = ['Weekly', 'Bi-Weekly', 'Monthly'];
    const priceRange: Record<string, number> = { Weekly: 16, 'Bi-Weekly': 18, Monthly: 24 };

    const priceRef = useRef<HTMLSpanElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const newPrice = priceRange[freq];

            gsap.fromTo(
                priceRef.current,
                { innerHTML: priceRef.current?.innerText.replace('$', '') },
                {
                    innerHTML: newPrice,
                    duration: 0.8,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        if (priceRef.current) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const tween = this as any;
                            priceRef.current.innerHTML = '$' + Math.round(Number(tween.targets()[0].innerHTML));
                        }
                    },
                }
            );

            if (freq !== 'Monthly') {
                gsap.to(badgeRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
            } else {
                gsap.to(badgeRef.current, { y: -10, opacity: 0, scale: 0.9, duration: 0.3 });
            }
        },
        { dependencies: [freq], scope: containerRef }
    );

    return (
        <div
            ref={containerRef}
            className="bg-[#1A1A1A] text-white rounded-[2rem] p-8 shadow-lg h-[26rem] flex flex-col border border-white/10 relative overflow-hidden tactile-hover"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold font-sans">The Roaster&apos;s Subscription</h3>
                    <p className="text-sm font-mono text-white/50 mt-1">Cancel anytime.</p>
                </div>
                <div
                    ref={badgeRef}
                    className="bg-clay/20 text-clay border border-clay/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap opacity-0 transform -translate-y-2 scale-90"
                >
                    Saves 15% Annually
                </div>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl mb-8 relative">
                {frequencies.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFreq(f)}
                        className={`flex-1 text-center py-2.5 text-xs font-mono font-medium rounded-lg transition-all duration-300 z-10 ${freq === f ? 'text-charcoal' : 'text-white/40 hover:text-white/70'
                            }`}
                    >
                        {f}
                    </button>
                ))}
                <div
                    className="absolute top-1 bottom-1 bg-cream rounded-lg shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                    style={{
                        width: `calc(33.333% - 5px)`,
                        transform: `translateX(${frequencies.indexOf(freq) * 100}%) translateX(${frequencies.indexOf(freq) * 4}px)`,
                    }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-sm font-mono text-white/40 mb-2 uppercase tracking-widest">Starting at</div>
                <div className="flex items-baseline gap-1 mt-2">
                    <span ref={priceRef} className="text-7xl font-sans font-light tracking-tight tabular-nums">
                        ${priceRange['Bi-Weekly']}
                    </span>
                    <span className="text-xl font-mono text-white/30">/bag</span>
                </div>
                <div className="text-sm text-white/60 mt-4 font-mono text-center">
                    Freshly roasted beans delivered automatically.
                </div>
            </div>

            <button className="mt-6 w-full bg-clay text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-colors hover:bg-clay/90">
                Configure Plan
            </button>
        </div>
    );
}

function ReserveCard() {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    const dates = [12, 13, 14, 15, 16, 17, 18];
    const availableSlots = [14, 16];

    useGSAP(
        () => {
            if (selectedDate) {
                gsap.to(drawerRef.current, {
                    height: 'auto',
                    opacity: 1,
                    marginTop: 16,
                    paddingTop: 16,
                    duration: 0.5,
                    ease: 'power3.out',
                });
            } else {
                gsap.to(drawerRef.current, {
                    height: 0,
                    opacity: 0,
                    marginTop: 0,
                    paddingTop: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                });
            }
        },
        { dependencies: [selectedDate], scope: containerRef }
    );

    return (
        <div
            ref={containerRef}
            className="bg-cream rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow duration-500 h-[26rem] flex flex-col border border-charcoal/5 relative overflow-hidden tactile-hover"
        >
            <div>
                <h3 className="text-xl font-bold font-sans text-charcoal">The Tasting Room Reserve</h3>
                <p className="text-sm font-mono opacity-60 mt-1">Guided by Head Roaster</p>
            </div>

            <div className="mt-6 flex-1">
                <div className="flex justify-between items-center mb-4 px-2 text-[10px] font-mono opacity-40 uppercase tracking-widest">
                    <span>October 2026</span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-moss/20" />
                        <div className="w-2 h-2 rounded-full bg-moss/50" />
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={'day-' + i} className="text-center text-[10px] font-mono opacity-30 font-bold">
                            {d}
                        </div>
                    ))}
                    {dates.map((date) => {
                        const isAvailable = availableSlots.includes(date);
                        const isSelected = selectedDate === date;
                        return (
                            <button
                                key={'date-' + date}
                                onClick={() => (isAvailable ? setSelectedDate(isSelected ? null : date) : null)}
                                className={`
                   aspect-square w-full rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                   ${!isAvailable ? 'opacity-20 cursor-not-allowed hidden md:flex' : ''}
                   ${isAvailable && !isSelected ? 'bg-moss/10 text-moss hover:bg-moss/20 hover:scale-105 hover:shadow-md cursor-pointer' : ''}
                   ${isSelected ? 'bg-moss text-cream scale-105 shadow-md cursor-pointer' : ''}
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
                    <span className="text-[11px] font-mono uppercase tracking-widest text-charcoal/60">
                        Saturday Cupping
                    </span>
                    <span className="text-xs font-bold text-clay mt-0.5">2 Seats Left</span>
                </div>
                <button className="w-full bg-charcoal text-cream py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors shrink-0">
                    Secure Reservation - $45
                </button>
            </div>
        </div>
    );
}

function LoyaltyCard() {
    const [cups, setCups] = useState(8);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCups((prev) => (prev === 8 ? 9 : 8));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useGSAP(
        () => {
            if (cups === 9) {
                gsap.fromTo(
                    '.cup-9',
                    { scale: 0.8 },
                    {
                        scale: 1.15,
                        duration: 0.5,
                        ease: 'back.out(2)',
                        yoyo: true,
                        repeat: 1,
                        boxShadow: '0px 0px 15px rgba(204, 88, 51, 0.5)',
                        backgroundColor: '#CC5833',
                        color: '#fff',
                    }
                );
            }
        },
        { dependencies: [cups], scope: containerRef }
    );

    return (
        <div
            ref={containerRef}
            className="bg-[#2E4036] text-cream rounded-[2rem] p-8 shadow-lg tactile-hover h-[26rem] flex flex-col border border-white/5 relative bg-noise"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold font-sans">Lumina Rewards</h3>
                <div className="w-8 h-8 rounded-full border border-cream/20 flex items-center justify-center bg-white/5">
                    <Coffee size={14} className="opacity-80" />
                </div>
            </div>
            <p className="text-sm font-mono opacity-80 mt-1">
                <span className="font-bold text-clay">
                    {cups}/10 Coffees
                </span>{' '}
                — You are {10 - cups} away from a free Pour Over!
            </p>

            <div className="flex-1 flex flex-col justify-center my-6">
                <div className="grid grid-cols-5 gap-y-6 gap-x-3">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const isFilled = i < cups;
                        const isNinth = i === 8;
                        return (
                            <div
                                key={i}
                                className={`
                  aspect-square rounded-xl flex items-center justify-center transition-all duration-500
                  ${isFilled && !isNinth ? 'bg-cream text-moss' : ''}
                  ${!isFilled && !isNinth ? 'bg-black/20 text-cream/20' : ''}
                  ${isNinth ? 'cup-9 bg-black/20 text-cream/20 relative z-10' : ''}
                `}
                            >
                                <Coffee size={22} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-xs font-mono text-white/50 uppercase tracking-widest mt-auto border-t border-cream/10 pt-4 text-center">
                Encourages repeat visits and customer loyalty.
            </div>
        </div>
    );
}

// ─── Section Components ───

function Features() {
    return (
        <section id="features" className="py-32 px-8 md:px-16 bg-cream text-charcoal">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-moss text-4xl md:text-5xl font-bold mb-12 text-center">
                    Built for Modern Coffee Experiences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QueueCard />
                    <SubscriptionCard />
                    <ReserveCard />
                    <LoyaltyCard />
                </div>
            </div>
        </section>
    );
}

function Philosophy() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef1 = useRef<HTMLParagraphElement>(null);
    const textRef2 = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            gsap.fromTo(
                [textRef1.current, textRef2.current],
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                    },
                }
            );
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            id="philosophy"
            className="py-40 px-8 relative overflow-hidden bg-moss bg-noise text-cream min-h-[80vh] flex items-center"
        >
            <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-12 w-full">
                <p ref={textRef1} className="text-2xl md:text-3xl font-sans opacity-80">
                    Most cafes focus on speed and massive volume.
                </p>
                <p ref={textRef2} className="text-5xl md:text-8xl font-drama italic">
                    We focus on the <span className="text-clay">Acoustics</span> of extraction.
                </p>
            </div>
        </section>
    );
}

function Protocol() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(
        () => {
            const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: cards[i + 1],
                    start: 'top bottom',
                    end: 'top top',
                    scrub: 1, // Smooth scrub
                    animation: gsap.to(card, {
                        scale: 0.92,
                        ease: 'none',
                    }),
                });
            });
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} id="protocol" className="bg-charcoal relative">
            {/* Card 1 */}
            <div
                ref={(el) => { cardsRef.current[0] = el; }}
                className="h-screen w-full flex items-center justify-center bg-[#F2F0E9] text-charcoal sticky top-0 origin-top z-10"
            >
                <div className="max-w-4xl w-full px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="font-mono text-xl opacity-60 mb-6 tracking-widest uppercase">
                            01 // Acoustic Curation
                        </div>
                        <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tight mb-6 text-balance">
                            Calm Acoustic Environment
                        </h2>
                        <p className="text-xl md:text-2xl font-mono opacity-80 max-w-lg">
                            Designed to minimize noise and distractions, creating a peaceful space for focused work and relaxed
                            conversations.
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <svg className="w-full h-64 max-w-md" viewBox="0 0 200 200" fill="none">
                            <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.5" fill="#2E4036" opacity="0.15" />
                            </pattern>
                            <rect x="0" y="0" width="200" height="200" fill="url(#dotGrid)" />
                            <path stroke="#2E4036" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                                <animate
                                    attributeName="d"
                                    dur="4s"
                                    repeatCount="indefinite"
                                    values="
                    M 0 100 Q 20 20, 40 100 T 80 100 T 120 100 T 160 100 T 200 100;
                    M 0 100 Q 20 100, 40 100 T 80 100 T 120 100 T 160 100 T 200 100;
                    M 0 100 Q 20 20, 40 100 T 80 100 T 120 100 T 160 100 T 200 100
                  "
                                    keyTimes="0; 0.5; 1"
                                    calcMode="spline"
                                    keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                                />
                            </path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div
                ref={(el) => { cardsRef.current[1] = el; }}
                className="h-screen w-full flex items-center justify-center bg-[#E8E6DF] text-charcoal sticky top-0 origin-top z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
            >
                <div className="max-w-4xl w-full px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="font-mono text-xl opacity-60 mb-6 tracking-widest uppercase">
                            02 // Architectural Warmth
                        </div>
                        <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tight mb-6 text-balance">
                            Warm, Natural Interior
                        </h2>
                        <p className="text-xl md:text-2xl font-mono opacity-80 max-w-lg">
                            Crafted with natural materials and warm lighting to create a comfortable and inviting atmosphere.
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center items-center relative w-full h-64 overflow-hidden rounded-3xl">
                        <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
                            <path
                                d="M 40 200 L 40 80 A 60 60 0 0 1 160 80 L 160 200"
                                stroke="#2E4036"
                                strokeWidth="4"
                                fill="transparent"
                            />
                            <polygon
                                points="50,190 150,190 130,80 70,80"
                                fill="#CC5833"
                                opacity="0.2"
                                className="animate-[sunbeam_10s_ease-in-out_infinite_alternate] origin-bottom"
                            />
                            <style
                                dangerouslySetInnerHTML={{
                                    __html: `
                    @keyframes sunbeam {
                        0% { transform: skewX(-20deg); }
                        100% { transform: skewX(20deg); }
                    }
                  `,
                                }}
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div
                ref={(el) => { cardsRef.current[2] = el; }}
                className="h-screen w-full flex items-center justify-center bg-[#DFDDD6] text-charcoal sticky top-0 origin-top z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
            >
                <div className="max-w-4xl w-full px-8 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="font-mono text-xl opacity-60 mb-6 tracking-widest uppercase">
                            03 // The Analog Pace
                        </div>
                        <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tight mb-6 text-balance">
                            Slow-Crafted Coffee Experience
                        </h2>
                        <p className="text-xl md:text-2xl font-mono opacity-80 max-w-lg">
                            Every cup is prepared with care and precision, allowing you to slow down and enjoy a premium coffee
                            experience.
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center items-center h-64 overflow-hidden relative">
                        <svg className="w-full h-full max-w-sm" viewBox="0 0 200 200" fill="none">
                            <path d="M 60 90 L 65 140 C 68 160, 132 160, 135 140 L 140 90 Z" fill="#CC5833" opacity="0.9" />
                            <ellipse cx="100" cy="90" rx="40" ry="15" fill="#a54425" />
                            <ellipse cx="100" cy="90" rx="40" ry="15" fill="transparent" stroke="#CC5833" strokeWidth="4" />
                            <g stroke="#F2F0E9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8">
                                <path
                                    d="M 85 85 Q 95 70, 85 55 T 85 25"
                                    className="animate-[steam_3s_ease-in-out_infinite]"
                                />
                                <path
                                    d="M 100 85 Q 110 70, 100 55 T 100 25"
                                    className="animate-[steam_3s_ease-in-out_infinite_1s]"
                                />
                                <path
                                    d="M 115 85 Q 125 70, 115 55 T 115 25"
                                    className="animate-[steam_3s_ease-in-out_infinite_2s]"
                                />
                            </g>
                            <style
                                dangerouslySetInnerHTML={{
                                    __html: `
                    @keyframes steam {
                        0% { transform: translateY(10px) scale(0.8); opacity: 0; }
                        20% { opacity: 0.8; }
                        80% { opacity: 0.8; }
                        100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
                    }
                  `,
                                }}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    const items = [
        {
            id: 1,
            title: 'Jonathan Reyes',
            role: 'Daily Regular',
            description:
                'The Fast Pass queue literally changed my mornings. I tap reorder when I leave my apartment and my iced cortado is waiting flawlessly extracted by the time I walk in. Zero friction.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        },
        {
            id: 2,
            title: 'Sarah Jenkins',
            role: 'Remote Architect',
            description:
                "It's the acoustic curation for me. The space is actually quiet enough for deep focus work without feeling sterile. The warm terracotta and soft vinyl playing in the background is my sanctuary.",
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
        },
        {
            id: 3,
            title: 'Marcus Thorne',
            role: 'Home Brewer',
            description:
                "Their single-origin subscription is the most reliable I've found. The beans arrive two days off-roast, every single time. It's ruined other coffee for me, honestly.",
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
        },
    ];

    return (
        <section className="py-32 px-8 bg-cream border-t border-charcoal/5">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                <h2 className="text-moss text-4xl md:text-5xl font-bold font-sans tracking-tight mb-4 text-center">
                    The Word.
                </h2>
                <p className="font-mono text-charcoal/60 mb-12 text-center max-w-lg">
                    What our regulars are saying about the Lumina experience.
                </p>
                <TestimonialsCard items={items} />
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-charcoal text-cream rounded-t-[4rem] px-8 pt-16 pb-8 md:pt-24 mt-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-2">Lumina Café</h2>
                <p className="font-mono text-sm opacity-60">Small-batch acoustics.</p>

                <div className="my-16 w-full flex justify-center">
                    <SocialFlipButton />
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 w-full border-t border-cream/10 pt-8">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-sm opacity-80">System Operational</span>
                </div>
            </div>
        </footer>
    );
}

// ─── Exported Sections ───

export {
    Navbar,
    Hero,
    Features,
    Philosophy,
    Protocol,
    Testimonials,
    Footer,
    RevealLoader,
    CinematicIntro,
    HowItWorks,
    AboutUs,
};
