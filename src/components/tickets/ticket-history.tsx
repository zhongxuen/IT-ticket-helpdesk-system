"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticket.service";
import { EmptyState } from "@/components/ui/empty-state";
import type { TicketHistoryEntry } from "@/types/ticket";

const FIELD_LABELS: Record<string, string> = {
    status: "Status",
    assigned_it_id: "IT assignment",
    assigned_technician_id: "Technician assignment",
};

interface TicketHistoryProps {
    ticketId: string;
    refreshKey?: number;
}

export function TicketHistory({ ticketId, refreshKey }: TicketHistoryProps) {
    const [entries, setEntries] = useState<TicketHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        ticketService
            .getHistory(ticketId)
            .then((result) => {
                if (active) setEntries(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load history");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, [ticketId, refreshKey]);

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading history...</p>;
    if (error) return <p className="text-sm text-destructive">{error}</p>;
    if (entries.length === 0) return <EmptyState title="No history yet" description="Changes to this ticket will appear here." />;

    return (
        <ul className="space-y-2">
            {entries.map((entry) => (
                <li key={entry.id} className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{entry.changedByName ?? "System"}</span>{" "}
                    changed {FIELD_LABELS[entry.fieldName] ?? entry.fieldName} from{" "}
                    <span className="font-medium">{entry.oldValue ?? "—"}</span> to{" "}
                    <span className="font-medium">{entry.newValue ?? "—"}</span>
                    <span className="ml-2 text-xs">{new Date(entry.createdAt).toLocaleString()}</span>
                </li>
            ))}
        </ul>
    );
}