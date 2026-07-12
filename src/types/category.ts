export interface TicketCategory {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
}