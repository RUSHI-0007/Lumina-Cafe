import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/auth-guard";
import { redirect } from "next/navigation";
import { ClipboardList, Coffee, CalendarDays, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        await requireAdmin();
    } catch {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white/90 font-sans antialiased flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#141414] border-r border-white/5 flex flex-col z-20">
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="font-bold text-lg tracking-tight text-white">Lumina Café</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">Staff Dashboard</div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <AdminNavLink href="/admin" icon={<ClipboardList size={18} />} label="Order Board" />
                    <AdminNavLink href="/admin/menu" icon={<Coffee size={18} />} label="Menu" />
                    <AdminNavLink href="/admin/reservations" icon={<CalendarDays size={18} />} label="Reservations" />
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 space-y-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Café
                    </Link>
                    <div className="flex items-center gap-3 px-3">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8 border border-white/10",
                                },
                            }}
                        />
                        <span className="text-xs text-white/40 font-mono">Admin</span>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 flex-1 min-h-screen">
                <div className="max-w-6xl mx-auto px-8 py-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

function AdminNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all group"
        >
            <span className="text-white/30 group-hover:text-clay transition-colors">{icon}</span>
            {label}
        </Link>
    );
}
