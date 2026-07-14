"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTicketStore } from "@/stores/ticket.store";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ROUTES } from "@/constants/routes";

interface TicketListProps {
    statusFilter?: string | null;
}

export function TicketList({ statusFilter = null }: TicketListProps) {
    const { tickets, isLoading, error, page, pageSize, total, fetchTickets } = useTicketStore();

    useEffect(() => {
        fetchTickets(1, statusFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link href={ROUTES.NEW_TICKET}>
                    <Button>New Ticket</Button>
                </Link>
            </div>

            {isLoading && <p className="text-muted-foreground">Loading tickets...</p>}
            {!isLoading && error && <p className="text-destructive">{error}</p>}
            {!isLoading && !error && tickets.length === 0 && <p className="text-muted-foreground">No tickets found.</p>}
            {!isLoading && !error && tickets.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
                        <table className="w-full min-w-140 text-sm">
                            <thead className="bg-muted/60 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">#</th>
                                    <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Title</th>
                                    <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-t border-border transition-colors hover:bg-primary/5">
                                        <td className="px-4 py-2">
                                            <Link href={`${ROUTES.TICKETS}/${ticket.id}`} className="text-primary hover:underline">
                                                #{ticket.ticketNumber}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">{ticket.title}</td>
                                        <td className="px-4 py-2">
                                            <TicketStatusBadge status={ticket.status} />
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(p) => fetchTickets(p, statusFilter)} />
                </>
            )}
        </div>
    );
}