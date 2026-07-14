"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/nav-items";
import type { UserRole } from "@/types/database";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";

interface SidebarProps {
    role: UserRole;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-card transition-transform duration-200 ease-out md:static md:z-auto md:w-60 md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-4">
                    <span className="select-none text-xl font-bold tracking-tight text-primary">
                        {APP_CONFIG.name}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="select-none rounded-md p-1 text-foreground/70 hover:bg-muted hover:text-primary md:hidden"
                    >
                        ✕
                    </button>
                </div>
                <nav className="flex flex-col gap-1 px-2">
                    {items.map((item, i) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className={cn(
                                "animate-slide-in select-none rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary hover:translate-x-0.5",
                                pathname === item.href && "bg-primary/10 text-primary font-semibold"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}