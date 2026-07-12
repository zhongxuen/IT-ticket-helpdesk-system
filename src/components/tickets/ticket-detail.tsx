"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticket.service";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { TicketComments } from "@/components/tickets/ticket-comments";
import type { Ticket } from "@/types/ticket";

interface TicketDetailProps {
    id: string;
}

export function TicketDetail({ id }: TicketDetailProps) {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        ticketService
            .getById(id)
            .then((result) => {
                if (active) setTicket(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load ticket");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, [id]);

    if (isLoading) return <p className="text-muted-foreground">Loading ticket...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (!ticket) return <p className="text-muted-foreground">Ticket not found.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">#{ticket.ticketNumber} {ticket.title}</h1>
                <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="whitespace-pre-wrap text-sm text-foreground">{ticket.description}</p>

            <TicketComments ticketId={ticket.id} />
        </div>
    );
}