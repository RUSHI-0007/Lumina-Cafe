'use client';

import { motion, Variants } from 'framer-motion';
import { ShoppingBag, Zap, Gift } from 'lucide-react';

export function HowItWorks() {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="py-24 px-8 md:px-16 bg-[#F8F9FA] text-charcoal">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">
                        Zero Apps. Zero Passwords. Just Free Coffee.
                    </h2>
                    <p className="text-lg font-mono opacity-60 max-w-2xl mx-auto">
                        A loyalty system so frictionless, it feels like magic.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {/* Step 1 */}
                    <motion.div variants={item} className="bg-white rounded-[2rem] p-10 shadow-sm border border-charcoal/5 flex flex-col relative overflow-hidden tactile-hover">
                        <div className="w-14 h-14 bg-moss/10 text-moss rounded-full flex items-center justify-center mb-6 shrink-0">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-xl font-bold font-sans mb-4">Step 1: Order Your First Cup</h3>
                        <p className="font-mono opacity-80 leading-relaxed text-sm">
                            Add your favorite drink to the cart and enter your email at checkout to get your receipt. We instantly create your secure, invisible punch card and add your first point.
                        </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div variants={item} className="bg-[#2E4036] text-cream rounded-[2rem] p-10 shadow-lg border border-white/5 flex flex-col relative overflow-hidden tactile-hover bg-noise">
                        <div className="w-14 h-14 bg-white/10 text-clay rounded-full flex items-center justify-center mb-6 shrink-0">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold font-sans mb-4">Step 2: The 2-Second Reorder</h3>
                        <p className="font-mono opacity-80 leading-relaxed text-sm">
                            When you come back tomorrow, your phone will already remember you. Just hit &quot;Apple Pay&quot; to skip the line. We track your coffees automatically in the background.
                        </p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div variants={item} className="bg-[#CC5833] text-cream rounded-[2rem] p-10 shadow-lg border border-white/5 flex flex-col relative overflow-hidden tactile-hover">
                        <div className="w-14 h-14 bg-white/20 text-white rounded-full flex items-center justify-center mb-6 shrink-0">
                            <Gift size={24} />
                        </div>
                        <h3 className="text-xl font-bold font-sans mb-4">Step 3: The 10th Cup is Magic</h3>
                        <p className="font-mono opacity-90 leading-relaxed text-sm">
                            When it&apos;s time for your 10th coffee, there is nothing for you to click or claim. Your cart total will automatically drop to $0.00. This one is on us.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
