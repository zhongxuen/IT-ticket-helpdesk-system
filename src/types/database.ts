export type UserRole =
    | "admin"
    | "it"
    | "technician"
    | "employee";

export type TicketStatus =
    | "new"
    | "assigned"
    | "in_progress"
    | "waiting_employee"
    | "resolved"
    | "closed"
    | "cancelled";

export type CommentVisibility =
    | "public"
    | "internal";