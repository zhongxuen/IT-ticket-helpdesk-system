import { cn } from "@/lib/utils";

export type TicketPriority = "low" | "medium" | "high";

const STYLES: Record<TicketPriority, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/15 text-warning",
    high: "bg-destructive/15 text-destructive",
};

const LABELS: Record<TicketPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STYLES[priority])}>
            {LABELS[priority]}
        </span>
    );
}