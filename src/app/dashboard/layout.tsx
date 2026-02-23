import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F2F0E9] font-sans antialiased flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#F2F0E9]/80 backdrop-blur-xl border-b border-charcoal/5 px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors font-medium text-sm"
                >
                    <ArrowLeft size={16} /> Skip to Café
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <div className="font-bold text-charcoal text-sm">Customer Portal</div>
                        <div className="font-mono text-xs text-charcoal/50 uppercase tracking-widest">Lumina Café</div>
                    </div>
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "w-10 h-10 border-2 border-sage/20",
                            }
                        }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden pt-8 pb-24 px-6 md:px-12">
                <div className="max-w-6xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
