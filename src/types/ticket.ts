import type { TicketStatus } from "./database";

export interface Ticket {
    id: string;
    ticketNumber: number;

    title: string;
    description: string;

    status: TicketStatus;

    employeeId: string;

    assignedItId?: string | null;
    assignedTechnicianId?: string | null;

    categoryId?: string | null;
    previousTicketId?: string | null;

    firstReviewedAt?: string | null;
    resolvedAt?: string | null;
    closedAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface TicketHistoryEntry {
    id: string;
    ticketId: string;
    changedBy: string | null;
    changedByName?: string | null;
    fieldName: string;
    oldValue: string | null;
    newValue: string | null;
    createdAt: string;
}