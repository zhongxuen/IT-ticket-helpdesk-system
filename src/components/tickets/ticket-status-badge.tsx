import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/types/database";

const STATUS_STYLES: Record<TicketStatus, string> = {
    new: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
    assigned: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
    in_progress: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    waiting_employee: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
    resolved: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
    closed: "bg-muted text-muted-foreground ring-1 ring-border",
    cancelled: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
    new: "New",
    assigned: "Assigned",
    in_progress: "In Progress",
    waiting_employee: "Waiting on Employee",
    resolved: "Resolved",
    closed: "Closed",
    cancelled: "Cancelled",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", STATUS_STYLES[status])}>
            {STATUS_LABELS[status]}
        </span>
    );
}