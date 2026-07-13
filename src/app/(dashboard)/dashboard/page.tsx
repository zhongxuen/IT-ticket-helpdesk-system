"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticket.service";
import { SummaryCard } from "@/components/ui/summary-card";

interface Summary {
    open: number;
    pending: number;
    resolved: number;
    cancelled: number;
}

export default function DashboardPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        ticketService
            .getSummary()
            .then((result) => {
                if (active) setSummary(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load summary");
            });
        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!error && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard label="Open" value={summary?.open ?? 0} tone="default" />
                    <SummaryCard label="Pending" value={summary?.pending ?? 0} tone="warning" />
                    <SummaryCard label="Resolved" value={summary?.resolved ?? 0} tone="success" />
                    <SummaryCard label="Cancelled" value={summary?.cancelled ?? 0} tone="destructive" />
                </div>
            )}
        </div>
    );
}