import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/types/database";

const STATUS_STYLES: Record<TicketStatus, string> = {
    new: "bg-blue-100 text-blue-800",
    assigned: "bg-purple-100 text-purple-800",
    in_progress: "bg-amber-100 text-amber-800",
    waiting_employee: "bg-orange-100 text-orange-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-muted text-muted-foreground",
    cancelled: "bg-red-100 text-red-800",
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
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
            {STATUS_LABELS[status]}
        </span>
    );
}