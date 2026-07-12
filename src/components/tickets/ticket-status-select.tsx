"use client";

import { useState } from "react";
import { ticketService } from "@/services/ticket.service";
import { STATUS_TRANSITIONS } from "@/constants/ticket-status";
import { Button } from "@/components/ui/button";
import type { TicketStatus } from "@/types/database";

const STATUS_LABELS: Record<TicketStatus, string> = {
    new: "New",
    assigned: "Assigned",
    in_progress: "In Progress",
    waiting_employee: "Waiting on Employee",
    resolved: "Resolved",
    closed: "Closed",
    cancelled: "Cancelled",
};

interface TicketStatusSelectProps {
    ticketId: string;
    currentStatus: TicketStatus;
    changedBy: string;
    onChanged: (newStatus: TicketStatus) => void;
}

export function TicketStatusSelect({ ticketId, currentStatus, changedBy, onChanged }: TicketStatusSelectProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nextStatuses = STATUS_TRANSITIONS[currentStatus] ?? [];

    if (nextStatuses.length === 0) return null;

    const handleChange = async (status: TicketStatus) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await ticketService.updateStatus(ticketId, status, changedBy);
            onChanged(status);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {nextStatuses.map((status) => (
                    <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={() => handleChange(status as TicketStatus)}
                    >
                        Mark as {STATUS_LABELS[status as TicketStatus]}
                    </Button>
                ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}