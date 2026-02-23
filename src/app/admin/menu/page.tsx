import { prisma } from "@/lib/db/prisma";
import MenuTable from "@/components/admin/menu-table";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
    const products = await prisma.product.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });

    const serializedProducts = products.map((p) => ({
        ...p,
        price: Number(p.price),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Menu Management</h1>
                <p className="font-mono text-sm text-white/40 mt-1 uppercase tracking-widest">
                    {serializedProducts.length} items across all categories
                </p>
            </div>
            <MenuTable products={serializedProducts} />
        </div>
    );
}
