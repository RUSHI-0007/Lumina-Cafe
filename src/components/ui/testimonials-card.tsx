'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface TestimonialItem {
    id: number;
    title: string;
    role: string;
    description: string;
    image: string;
}

interface TestimonialsCardProps {
    items: TestimonialItem[];
    className?: string;
    width?: number;
    showNavigation?: boolean;
    showCounter?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

export default function TestimonialsCard({
    items,
    className,
    width = 900,
    showNavigation = true,
    showCounter = true,
    autoPlay = false,
    autoPlayInterval = 3000,
}: TestimonialsCardProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const activeItem = items[activeIndex];

    useEffect(() => {
        if (!autoPlay || items.length <= 1) return;
        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, items.length]);

    const handleNext = () => {
        if (activeIndex < items.length - 1) {
            setDirection(1);
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setDirection(-1);
            setActiveIndex(activeIndex - 1);
        }
    };

    const rotations = useMemo(() => [4, -2, -9, 7], []);

    if (!items || items.length === 0) return null;

    return (
        <div className={cn('flex flex-col items-center justify-center p-8', className)}>
            <div
                className="relative grid grid-cols-1 md:grid-cols-[1fr_1.2fr] grid-rows-[auto_auto_auto] gap-x-12 gap-y-4 w-full"
                style={{ perspective: '1400px', maxWidth: `${width}px` }}
            >
                <div className="col-start-1 row-start-1 md:row-span-3 relative w-full aspect-square mt-8 md:mt-0 max-w-[280px] md:max-w-none mx-auto">
                    <AnimatePresence custom={direction}>
                        {items.map((item, index) => {
                            const isActive = index === activeIndex;
                            const offset = index - activeIndex;
                            return (
                                <motion.div
                                    key={item.id}
                                    className="absolute inset-0 w-full h-full overflow-hidden border-[6px] bg-[#E8E6DF] border-white shadow-2xl rounded-[2rem]"
                                    initial={{
                                        x: offset * 15,
                                        y: Math.abs(offset) * 6,
                                        z: -150 * Math.abs(offset),
                                        scale: 0.85 - Math.abs(offset) * 0.04,
                                        rotateZ: rotations[index % 4],
                                        opacity: isActive ? 1 : 0.5,
                                        zIndex: 10 - Math.abs(offset),
                                    }}
                                    animate={
                                        isActive
                                            ? {
                                                x: [offset * 15, direction === 1 ? -200 : 200, 0],
                                                y: [Math.abs(offset) * 6, 0, 0],
                                                z: [-200, 150, 250],
                                                scale: [0.85, 1.05, 1],
                                                rotateZ: [rotations[index % 4], -5, 0],
                                                opacity: 1,
                                                zIndex: 100,
                                            }
                                            : {
                                                x: offset * 15,
                                                y: Math.abs(offset) * 6,
                                                z: -150 * Math.abs(offset),
                                                rotateZ: rotations[index % 4],
                                                scale: 0.85 - Math.abs(offset) * 0.04,
                                                opacity: 0.55,
                                                zIndex: 10 - Math.abs(offset),
                                            }
                                    }
                                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover grayscale opacity-90 mix-blend-multiply pointer-events-none"
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="col-start-1 md:col-start-2 row-start-2 flex flex-col justify-center min-h-[160px] text-center md:text-left mt-12 md:mt-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -25 }}
                            transition={{ duration: 0.35 }}
                        >
                            <h3 className="text-2xl font-bold font-sans tracking-tight text-charcoal">
                                {activeItem.title}
                            </h3>
                            <p className="text-xl font-drama italic text-clay mt-1">{activeItem.role}</p>
                            <p className="text-base leading-relaxed text-charcoal/80 mt-4 font-mono">
                                &quot;{activeItem.description}&quot;
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {showNavigation && items.length > 1 && (
                    <div className="col-start-1 md:col-start-2 row-start-3 flex items-center gap-4 mt-6">
                        <button
                            disabled={activeIndex === 0}
                            onClick={handlePrev}
                            className={cn(
                                'flex items-center justify-center w-12 h-12 rounded-full border border-charcoal/20 bg-cream transition-all',
                                activeIndex === 0
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-charcoal/5 hover:scale-105'
                            )}
                        >
                            <ArrowLeft className="w-5 h-5 text-charcoal" />
                        </button>
                        <button
                            disabled={activeIndex === items.length - 1}
                            onClick={handleNext}
                            className={cn(
                                'flex items-center justify-center w-12 h-12 rounded-full border border-charcoal/20 bg-cream transition-all',
                                activeIndex === items.length - 1
                                    ? 'opacity-30 cursor-not-allowed'
                                    : 'hover:bg-charcoal/5 hover:scale-105'
                            )}
                        >
                            <ArrowRight className="w-5 h-5 text-charcoal" />
                        </button>
                        {showCounter && (
                            <span className="font-mono text-sm text-neutral-500">
                                {activeIndex + 1} / {items.length}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
