export const TICKET_STATUS = {
    NEW: "new",
    ASSIGNED: "assigned",
    IN_PROGRESS: "in_progress",
    WAITING_EMPLOYEE: "waiting_employee",
    RESOLVED: "resolved",
    CLOSED: "closed",
    CANCELLED: "cancelled",
} as const;

export const STATUS_TRANSITIONS: Record<string, string[]> = {
    new: ["assigned", "cancelled"],
    assigned: ["in_progress", "cancelled"],
    in_progress: ["waiting_employee", "resolved", "cancelled"],
    waiting_employee: ["in_progress", "resolved", "cancelled"],
    resolved: ["closed", "in_progress"],
    closed: [],
    cancelled: [],
};

export const STATUS_CHANGE_ROLES = ["admin", "it", "technician"] as const;