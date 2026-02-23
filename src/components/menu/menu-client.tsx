'use client';

/**
 * MenuClient — Client Component
 *
 * Renders the menu with animated category tabs and product cards.
 * Receives pre-fetched data from the MenuSection server component.
 *
 * @module components/menu/menu-client
 */

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCartStore } from '@/lib/store/cart';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ───

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
    category: string;
    imageUrl: string | null;
    isFeatured: boolean;
    isSoldOut: boolean;
    sortOrder: number;
}

interface MenuClientProps {
    groupedProducts: Record<string, Product[]>;
}

// ─── Category Display Config ───

const CATEGORY_LABELS: Record<string, string> = {
    ESPRESSO: 'Espresso',
    POUR_OVER: 'Pour Over',
    COLD_BREW: 'Cold Brew',
    PASTRY: 'Pastry',
    SEASONAL: 'Seasonal',
    MERCHANDISE: 'Merchandise',
};

const CATEGORY_ORDER = ['ESPRESSO', 'POUR_OVER', 'COLD_BREW', 'PASTRY', 'SEASONAL', 'MERCHANDISE'];

// ─── Product Card ───

function ProductCard({ product, index }: { product: Product; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { addItem, setIsOpen } = useCartStore();

    useGSAP(
        () => {
            gsap.fromTo(
                cardRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: 'power3.out',
                }
            );
        },
        { scope: cardRef }
    );

    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

    return (
        <div
            ref={cardRef}
            className="group relative bg-cream rounded-2xl overflow-hidden border border-charcoal/5 hover:shadow-xl transition-all duration-500 opacity-0"
        >
            {/* Image */}
            {product.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                    {product.isFeatured && (
                        <span className="absolute top-3 right-3 bg-clay text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                            Featured
                        </span>
                    )}
                    {product.isSoldOut && (
                        <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                            <span className="text-cream font-mono text-sm uppercase tracking-widest">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-lg font-bold font-sans text-charcoal leading-tight">
                        {product.name}
                    </h3>
                    <span className="text-clay font-bold font-mono text-lg whitespace-nowrap">
                        ${price.toFixed(2)}
                    </span>
                </div>
                <p className="text-sm font-mono text-charcoal/60 leading-relaxed line-clamp-2">
                    {product.description}
                </p>
                <button
                    onClick={() => {
                        addItem({
                            productId: product.id,
                            name: product.name,
                            price: price,
                            imageUrl: product.imageUrl,
                        });
                        setIsOpen(true);
                    }}
                    disabled={product.isSoldOut}
                    className="mt-4 w-full bg-charcoal/5 hover:bg-charcoal text-charcoal hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

// ─── Main Menu Client Component ───

export default function MenuClient({ groupedProducts }: MenuClientProps) {
    const availableCategories = CATEGORY_ORDER.filter(
        (cat) => groupedProducts[cat] && groupedProducts[cat].length > 0
    );
    const [activeCategory, setActiveCategory] = useState(availableCategories[0] || 'ESPRESSO');
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.fromTo(
                headerRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                }
            );
        },
        { scope: sectionRef }
    );

    const currentProducts = (groupedProducts[activeCategory] || []) as Product[];

    return (
        <section
            ref={sectionRef}
            id="menu"
            className="py-32 px-8 md:px-16 bg-white text-charcoal relative overflow-hidden"
        >
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #2E4036 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-16">
                    <h2 className="text-moss text-4xl md:text-5xl font-bold mb-4">
                        The Menu
                    </h2>
                    <p className="font-mono text-charcoal/60 max-w-lg mx-auto">
                        Every cup is sourced, roasted, and extracted with intention.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-cream rounded-2xl p-1.5 gap-1 border border-charcoal/5">
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-mono font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-moss text-cream shadow-sm'
                                    : 'text-charcoal/50 hover:text-charcoal hover:bg-white'
                                    }`}
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} />
                    ))}
                </div>

                {/* Item count */}
                <div className="mt-8 text-center">
                    <span className="font-mono text-xs text-charcoal/30 uppercase tracking-widest">
                        {currentProducts.length} {currentProducts.length === 1 ? 'item' : 'items'} in{' '}
                        {CATEGORY_LABELS[activeCategory]}
                    </span>
                </div>
            </div>
        </section>
    );
}
