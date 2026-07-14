"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/nav-items";
import type { UserRole } from "@/types/database";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";

interface SidebarProps {
    role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <aside className="hidden w-60 shrink-0 border-r border-border bg-muted/40 md:block">
            <div className="p-4 text-lg font-semibold text-primary">{APP_CONFIG.name}</div>
            <nav className="flex flex-col gap-1 px-2">
                {items.map((item, i) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className={cn(
                            "animate-slide-in rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary",
                            pathname === item.href && "bg-primary/10 text-primary font-semibold"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

interface EmptyStateProps {
    title: string;
    description?: string;
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
    return (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm font-medium text-foreground">{title}</p>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}