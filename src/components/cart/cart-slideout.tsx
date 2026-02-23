"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { X, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { processMockPayment } from "@/app/actions/checkout.actions";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

type CheckoutState = "REVIEW" | "PROCESSING" | "SUCCESS";

export function CartSlideout() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart } = useCartStore();
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [isHydrated, setIsHydrated] = useState(false);
    const [checkoutState, setCheckoutState] = useState<CheckoutState>("REVIEW");
    const router = useRouter();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Reset state when cart closes
    useEffect(() => {
        if (!isOpen && checkoutState !== "REVIEW") {
            setTimeout(() => setCheckoutState("REVIEW"), 300);
        }
    }, [isOpen, checkoutState]);

    if (!isHydrated) return null;

    async function handleCheckout() {
        if (items.length === 0) return;
        setCheckoutState("PROCESSING");

        const orderItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price
        }));

        const result = await processMockPayment(orderItems, total);

        if (result.success) {
            setCheckoutState("SUCCESS");
            clearCart();
            // Redirect to dashboard after a brief moment to admire the checkmark
            setTimeout(() => {
                setIsOpen(false);
                router.push("/dashboard");
            }, 1800);
        } else {
            alert("Failed to process payment. Please try again.");
            setCheckoutState("REVIEW");
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => checkoutState === "REVIEW" && setIsOpen(false)}
                        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50"
                    />

                    {/* Slideout Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col border-l border-sage/20"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-sage/20">
                            <h2 className="font-serif text-2xl text-charcoal flex items-center gap-2">
                                <ShoppingBag size={24} />
                                Your Order {items.length > 0 && checkoutState === "REVIEW" && `(${items.length})`}
                            </h2>
                            {checkoutState === "REVIEW" && (
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-charcoal/60 hover:text-charcoal transition-colors rounded-full hover:bg-sage/10"
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto relative">
                            <AnimatePresence mode="wait">
                                {checkoutState === "REVIEW" && (
                                    <motion.div
                                        key="review"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-6 flex flex-col gap-6 min-h-full"
                                    >
                                        {items.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-charcoal/50 mt-20">
                                                <ShoppingBag size={48} strokeWidth={1} />
                                                <p className="font-mono text-sm uppercase tracking-widest">Cart is empty</p>
                                            </div>
                                        ) : (
                                            items.map((item) => (
                                                <div key={item.productId} className="flex gap-4 bg-white/50 p-4 rounded-xl items-center border border-sage/10 relative overflow-hidden group">
                                                    <div className="relative w-20 h-20 bg-sage/20 rounded-lg overflow-hidden shrink-0">
                                                        {item.imageUrl && (
                                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col">
                                                        <h4 className="font-serif text-lg text-charcoal leading-tight">{item.name}</h4>
                                                        <span className="font-mono text-rust text-sm mt-1">${item.price.toFixed(2)}</span>

                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center gap-3 bg-cream border border-sage/20 rounded-full px-3 py-1">
                                                                <button
                                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                                    className="text-charcoal/60 hover:text-charcoal focus:outline-none"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                                    className="text-charcoal/60 hover:text-charcoal focus:outline-none"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.productId)}
                                                                className="text-charcoal/40 hover:text-rust transition-colors text-sm uppercase tracking-wider font-mono opacity-0 group-hover:opacity-100"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                )}

                                {checkoutState === "PROCESSING" && (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                                    >
                                        <div className="relative w-24 h-24 mb-8">
                                            {/* Outer spinning ring */}
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                                className="absolute inset-0 rounded-full border-2 border-sage/20 border-t-charcoal"
                                            />
                                            {/* Inner pulsing circle */}
                                            <motion.div
                                                animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                                                className="absolute inset-4 rounded-full bg-charcoal/5"
                                            />
                                            {/* Center icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <CreditCard className="text-charcoal/60" size={24} />
                                            </div>
                                        </div>
                                        <h3 className="font-serif text-2xl text-charcoal mb-2">Simulating Secure Payment</h3>
                                        <p className="font-mono text-sm text-charcoal/50 uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                                            Contacting payment gateway
                                        </p>
                                    </motion.div>
                                )}

                                {checkoutState === "SUCCESS" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                            className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20"
                                        >
                                            <motion.svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="w-10 h-10 text-green-600"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                                            >
                                                <motion.path
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </motion.svg>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <h3 className="font-serif text-3xl text-charcoal mb-2">Payment Successful</h3>
                                            <p className="font-mono text-sm text-charcoal/60 max-w-[250px] mx-auto leading-relaxed">
                                                Redirecting to your dashboard...
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer / Checkout Button */}
                        <AnimatePresence>
                            {checkoutState === "REVIEW" && items.length > 0 && (
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    className="p-6 border-t border-sage/20 bg-white/50 space-y-4"
                                >
                                    <div className="flex justify-between items-center text-charcoal">
                                        <span className="font-mono text-sm uppercase tracking-wider">Total</span>
                                        <span className="font-serif text-2xl font-semibold">${total.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-charcoal hover:bg-black text-cream py-4 rounded-xl font-medium tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                                    >
                                        Pay with Apple Pay <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-white border border-charcoal/10 hover:border-charcoal/30 text-charcoal py-3.5 rounded-xl font-medium tracking-wide transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <CreditCard size={16} className="opacity-50" /> Pay with Card (Demo)
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
