"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ticketService } from "@/services/ticket.service";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { TicketStatusSelect } from "@/components/tickets/ticket-status-select";
import { TicketAssign } from "@/components/tickets/ticket-assign";
import { TicketHistory } from "@/components/tickets/ticket-history";
import { TicketComments } from "@/components/tickets/ticket-comments";
import { Button } from "@/components/ui/button";
import type { Ticket } from "@/types/ticket";

interface TicketDetailProps {
    id: string;
}

export function TicketDetail({ id }: TicketDetailProps) {
    const router = useRouter();
    const profile = useAuthStore((s) => s.profile);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [previousTicket, setPreviousTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [historyKey, setHistoryKey] = useState(0);
    const [isReopening, setIsReopening] = useState(false);
    const [reopenError, setReopenError] = useState<string | null>(null);

    const canManage = !!profile && [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN].includes(profile.role as any);
    const isOwner = !!profile && ticket?.employeeId === profile.id;
    const canReopen = isOwner && ticket && ["resolved", "closed", "cancelled"].includes(ticket.status);

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

    useEffect(() => {
        if (!ticket?.previousTicketId) {
            setPreviousTicket(null);
            return;
        }
        let active = true;
        ticketService.getById(ticket.previousTicketId).then((result) => {
            if (active) setPreviousTicket(result);
        });
        return () => {
            active = false;
        };
    }, [ticket?.previousTicketId]);

    useEffect(() => {
        if (!canManage || !ticket || ticket.firstReviewedAt) return;
        let active = true;
        ticketService
            .markFirstReviewed(ticket.id)
            .then((updated) => {
                if (active) setTicket(updated);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [canManage, ticket]);

    const handleReopen = async () => {
        if (!profile || !ticket) return;
        setIsReopening(true);
        setReopenError(null);
        try {
            const newTicket = await ticketService.reopen(ticket.id, profile.id);
            router.push(`${ROUTES.TICKETS}/${newTicket.id}`);
        } catch (err) {
            setReopenError(err instanceof Error ? err.message : "Failed to reopen ticket");
        } finally {
            setIsReopening(false);
        }
    };

    if (isLoading) return <p className="text-muted-foreground">Loading ticket...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (!ticket) return <p className="text-muted-foreground">Ticket not found.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">#{ticket.ticketNumber} {ticket.title}</h1>
                <TicketStatusBadge status={ticket.status} />
            </div>

            {previousTicket && (
                <p className="text-sm text-muted-foreground">
                    Reopened from{" "}
                    <Link href={`${ROUTES.TICKETS}/${previousTicket.id}`} className="text-primary hover:underline">
                        #{previousTicket.ticketNumber}
                    </Link>
                </p>
            )}

            <p className="whitespace-pre-wrap text-sm text-foreground">{ticket.description}</p>

            {canReopen && (
                <div className="space-y-2">
                    <Button variant="outline" size="sm" onClick={handleReopen} disabled={isReopening}>
                        {isReopening ? "Reopening..." : "Reopen Ticket"}
                    </Button>
                    {reopenError && <p className="text-sm text-destructive">{reopenError}</p>}
                </div>
            )}

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

            {ticket.resolvedByName && (
                <p className="text-sm text-muted-foreground">Resolved by {ticket.resolvedByName}</p>
            )}

            <TicketComments ticketId={ticket.id} />

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">History</h2>
                <TicketHistory ticketId={ticket.id} refreshKey={historyKey} />
            </div>
        </div>
    );
}