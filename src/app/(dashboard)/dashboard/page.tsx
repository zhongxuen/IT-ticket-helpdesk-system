"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { ticketService } from "@/services/ticket.service";
import { SummaryCard } from "@/components/ui/summary-card";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

interface Summary {
    open: number;
    pending: number;
    resolved: number;
    cancelled: number;
}

export default function DashboardPage() {
    const profile = useAuthStore((s) => s.profile);
    const router = useRouter();
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profile) return;
        let active = true;
        ticketService
            .getSummary(profile)
            .then((result) => {
                if (active) setSummary(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load summary");
            });
        return () => {
            active = false;
        };
    }, [profile]);

    if (!profile) return null;

    const goToTickets = (status: string) => router.push(`${ROUTES.TICKETS}?status=${status}`);
    const isEmployee = profile.role === ROLES.EMPLOYEE;

    return (
        <div className="animate-slide-up space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isEmployee ? "My Tickets" : "Dashboard"}
            </h1>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!error && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard label="Open" value={summary?.open ?? 0} tone="default" onClick={() => goToTickets("open")} />
                    <SummaryCard
                        label="Pending"
                        value={summary?.pending ?? 0}
                        tone="warning"
                        onClick={() => goToTickets("waiting_employee")}
                    />
                    <SummaryCard label="Resolved" value={summary?.resolved ?? 0} tone="success" onClick={() => goToTickets("resolved")} />
                    <SummaryCard
                        label="Cancelled"
                        value={summary?.cancelled ?? 0}
                        tone="destructive"
                        onClick={() => goToTickets("cancelled")}
                    />
                </div>
            )}
        </div>
    );
}