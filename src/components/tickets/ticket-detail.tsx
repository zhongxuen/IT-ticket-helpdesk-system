"use client";

import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticket.service";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { TicketStatusSelect } from "@/components/tickets/ticket-status-select";
import { TicketAssign } from "@/components/tickets/ticket-assign";
import { TicketHistory } from "@/components/tickets/ticket-history";
import { TicketComments } from "@/components/tickets/ticket-comments";
import type { Ticket } from "@/types/ticket";

interface TicketDetailProps {
    id: string;
}

export function TicketDetail({ id }: TicketDetailProps) {
    const profile = useAuthStore((s) => s.profile);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [historyKey, setHistoryKey] = useState(0);

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

    const canManage = !!profile && [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN].includes(profile.role as any);

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

            {canManage && profile && (
                <div className="grid gap-4 md:grid-cols-2">
                    <TicketAssign
                        ticket={ticket}
                        changedBy={profile.id}
                        onAssigned={(assignedItId, assignedTechnicianId) => {
                            setTicket({ ...ticket, assignedItId, assignedTechnicianId });
                            setHistoryKey((k) => k + 1);
                        }}
                    />
                    <TicketStatusSelect
                        ticketId={ticket.id}
                        currentStatus={ticket.status}
                        changedBy={profile.id}
                        onChanged={(newStatus) => {
                            setTicket({ ...ticket, status: newStatus });
                            setHistoryKey((k) => k + 1);
                        }}
                    />
                </div>
            )}

            <TicketComments ticketId={ticket.id} />

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">History</h2>
                <TicketHistory ticketId={ticket.id} refreshKey={historyKey} />
            </div>
        </div>
    );
}