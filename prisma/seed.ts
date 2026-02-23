/**
 * Lumina Café — Database Seed Script
 *
 * Populates the database with premium, Lumina-branded placeholder data.
 * Run with: `npx prisma db seed`
 *
 * Prisma 7 requires a driver adapter — uses PrismaPg with DIRECT_URL.
 *
 * @module prisma/seed
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ No DIRECT_URL or DATABASE_URL found in .env");
    process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding Lumina Café database...\n");

    // ─── Clear existing data ───
    console.log("  🗑️  Clearing existing data...");
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.product.deleteMany();

    // ─── Products (Menu Items) ───
    console.log("  ☕ Creating menu items...");

    const products = await prisma.product.createMany({
        data: [
            // Espresso
            {
                name: "The Lumina Signature Cortado",
                description:
                    "Our house blend pulled as a double ristretto, balanced with velvety steamed oat milk. Served in a handcrafted ceramic cup.",
                price: 6.5,
                category: "ESPRESSO",
                imageUrl:
                    "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop",
                isFeatured: true,
                sortOrder: 1,
            },
            {
                name: "Midnight Espresso",
                description:
                    "A bold, full-bodied double shot from our dark-roasted Brazilian beans. Notes of cocoa and toasted walnut.",
                price: 4.5,
                category: "ESPRESSO",
                imageUrl:
                    "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=400&auto=format&fit=crop",
                sortOrder: 2,
            },
            {
                name: "Lavender Oat Latte",
                description:
                    "House-made French lavender syrup blended with our espresso and creamy oat milk. Finished with dried lavender buds.",
                price: 7.0,
                category: "ESPRESSO",
                imageUrl:
                    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&auto=format&fit=crop",
                isFeatured: true,
                sortOrder: 3,
            },

            // Pour Over
            {
                name: "Single-Origin Ethiopian Yirgacheffe",
                description:
                    "Light-roasted, hand-poured. Bright floral aromatics with notes of blueberry and jasmine. Sourced from the Gedeo Zone.",
                price: 8.0,
                category: "POUR_OVER",
                imageUrl:
                    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop",
                isFeatured: true,
                sortOrder: 1,
            },
            {
                name: "Colombian Huila Reserva",
                description:
                    "Medium-roasted single-origin from Huila. Sweet caramel body with a citrus finish. Washed process.",
                price: 7.5,
                category: "POUR_OVER",
                imageUrl:
                    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400&auto=format&fit=crop",
                sortOrder: 2,
            },

            // Cold Brew
            {
                name: "Golden Cardamom Cold Brew",
                description:
                    "24-hour steeped cold brew infused with crushed cardamom pods and a whisper of wild honey. Served over hand-cut ice.",
                price: 7.5,
                category: "COLD_BREW",
                imageUrl:
                    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&auto=format&fit=crop",
                isFeatured: true,
                sortOrder: 1,
            },
            {
                name: "Nitro Cascara Fizz",
                description:
                    "Nitrogen-infused cascara tea from our coffee cherry husks. Effervescent, lightly sweet, with hints of cherry and hibiscus.",
                price: 6.5,
                category: "COLD_BREW",
                imageUrl:
                    "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=400&auto=format&fit=crop",
                sortOrder: 2,
            },

            // Pastry
            {
                name: "Artisan Pistachio Croissant",
                description:
                    "Laminated butter croissant filled with house-made pistachio frangipane, crowned with crushed Sicilian pistachios.",
                price: 5.5,
                category: "PASTRY",
                imageUrl:
                    "https://images.unsplash.com/photo-1549996647-190b679b33d7?q=80&w=400&auto=format&fit=crop",
                isFeatured: true,
                sortOrder: 1,
            },
            {
                name: "Dark Chocolate & Sea Salt Cookie",
                description:
                    "Crisp edges, chewy center. Made with 72% Valrhona chocolate and Maldon sea salt. Paired perfectly with espresso.",
                price: 4.0,
                category: "PASTRY",
                imageUrl:
                    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=400&auto=format&fit=crop",
                sortOrder: 2,
            },

            // Seasonal
            {
                name: "Winter Spiced Cacao",
                description:
                    "Rich single-origin cacao from Ecuador, warmed with cinnamon, star anise, and a touch of cayenne. Topped with house-made marshmallow.",
                price: 8.5,
                category: "SEASONAL",
                imageUrl:
                    "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=400&auto=format&fit=crop",
                isFeatured: true,
                sortOrder: 1,
            },
        ],
    });

    console.log(`    ✓ Created ${products.count} products`);

    // ─── Fetch created products for order references ───
    const allProducts = await prisma.product.findMany();
    const cortado = allProducts.find((p) =>
        p.name.includes("Cortado")
    )!;
    const ethiopian = allProducts.find((p) =>
        p.name.includes("Ethiopian")
    )!;
    const croissant = allProducts.find((p) =>
        p.name.includes("Croissant")
    )!;
    const coldBrew = allProducts.find((p) =>
        p.name.includes("Cardamom")
    )!;

    // ─── Orders ───
    console.log("  📦 Creating sample orders...");

    await prisma.order.create({
        data: {
            customerName: "Jonathan Reyes",
            customerEmail: "jonathan@example.com",
            status: "COMPLETED",
            totalAmount: 12.0,
            notes: "Extra shot, light ice on the cortado please",
            items: {
                create: [
                    { productId: cortado.id, quantity: 1, unitPrice: cortado.price },
                    { productId: croissant.id, quantity: 1, unitPrice: croissant.price },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            customerName: "Sarah Jenkins",
            customerEmail: "sarah@example.com",
            status: "PREPARING",
            totalAmount: 15.5,
            items: {
                create: [
                    { productId: ethiopian.id, quantity: 1, unitPrice: ethiopian.price },
                    { productId: coldBrew.id, quantity: 1, unitPrice: coldBrew.price },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            customerName: "Marcus Thorne",
            status: "PENDING",
            totalAmount: 6.5,
            items: {
                create: [
                    { productId: cortado.id, quantity: 1, unitPrice: cortado.price },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            customerName: "Elena Rostova",
            customerEmail: "elena@example.com",
            status: "PAID",
            totalAmount: 11.5,
            notes: "Oat milk please",
            items: {
                create: [
                    { productId: croissant.id, quantity: 1, unitPrice: croissant.price },
                    { productId: coldBrew.id, quantity: 1, unitPrice: coldBrew.price },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            customerName: "David Chen",
            status: "READY",
            totalAmount: 4.5,
            items: {
                create: [
                    { productId: ethiopian.id, quantity: 1, unitPrice: ethiopian.price },
                ],
            },
        },
    });

    console.log("    ✓ Created 5 sample orders");

    // ─── Reservations ───
    console.log("  📅 Creating sample reservations...");

    // Generate future dates
    const today = new Date();
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));

    const followingSaturday = new Date(nextSaturday);
    followingSaturday.setDate(nextSaturday.getDate() + 7);

    await prisma.reservation.createMany({
        data: [
            {
                guestName: "Aria Velasquez",
                guestEmail: "aria@example.com",
                guestPhone: "+1-555-0142",
                partySize: 2,
                date: nextSaturday,
                timeSlot: "14:00",
                status: "CONFIRMED",
                specialRequests: "Window seat preferred, celebrating anniversary",
            },
            {
                guestName: "Theo Ashworth",
                guestEmail: "theo@example.com",
                partySize: 4,
                date: nextSaturday,
                timeSlot: "16:00",
                status: "PENDING",
                specialRequests: "Interested in the tasting flight",
            },
            {
                guestName: "Mila Chen",
                guestEmail: "mila@example.com",
                guestPhone: "+1-555-0198",
                partySize: 6,
                date: followingSaturday,
                timeSlot: "14:00",
                status: "CONFIRMED",
                specialRequests: "Corporate team outing — need one long table",
            },
        ],
    });

    console.log("    ✓ Created 3 sample reservations\n");

    console.log("✅ Seed complete! Lumina Café database is ready.\n");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
