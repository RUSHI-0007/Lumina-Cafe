/**
 * MenuSection — Server Component
 *
 * Fetches products grouped by category from Supabase on the server,
 * then passes the data to the client component for animated rendering.
 *
 * @module components/menu/menu-section
 */

import { getProductsByCategory } from "@/services/product.service";
import MenuClient from "./menu-client";

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

export default async function MenuSection() {
    const result = await getProductsByCategory();

    if (!result.success) {
        return (
            <section id="menu" className="py-32 px-8 md:px-16 bg-white text-charcoal">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-moss text-4xl md:text-5xl font-bold mb-4">
                        Our Menu
                    </h2>
                    <p className="font-mono text-charcoal/60">
                        Unable to load menu at this time. Please try again later.
                    </p>
                </div>
            </section>
        );
    }

    // Cast from Record<string, unknown[]> to Record<string, Product[]>
    const groupedProducts = result.data as Record<string, Product[]>;

    return <MenuClient groupedProducts={groupedProducts} />;
}
