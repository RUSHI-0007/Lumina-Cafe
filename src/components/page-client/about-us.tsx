'use client';

import { motion } from 'framer-motion';

export function AboutUs() {
    return (
        <section className="relative py-32 px-8 overflow-hidden bg-charcoal text-cream min-h-[60vh] flex items-center">
            {/* Subtle background image/texture placeholder */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2000&auto=format&fit=crop"
                    alt="Coffee roasting process"
                    className="w-full h-full object-cover opacity-[0.15]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-clay mb-4">
                        The Lumina Philosophy
                    </h2>
                    <p className="text-3xl md:text-5xl font-sans font-light leading-tight text-balance opacity-90">
                        We believe that craft coffee shouldn&apos;t require a 15-minute wait, and world-class service shouldn&apos;t require downloading another app.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <p className="text-lg md:text-xl font-mono leading-relaxed opacity-70 max-w-3xl">
                        Lumina was built for the modern coffee drinker who respects quality and values their time. We source our beans ethically, roast them meticulously, and use cutting-edge technology so you can order your perfect pour-over from your phone and have it waiting on the bar the second you walk in.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
