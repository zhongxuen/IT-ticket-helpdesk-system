import { create } from "zustand";
import type { Ticket } from "@/types/ticket";
import { ticketService } from "@/services/ticket.service";
import { APP_CONFIG } from "@/config/app";

interface TicketState {
    tickets: Ticket[];
    isLoading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    total: number;
    statusFilter: string | null;
    fetchTickets: (page?: number, statusFilter?: string | null) => Promise<void>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
    tickets: [],
    isLoading: false,
    error: null,
    page: 1,
    pageSize: APP_CONFIG.pagination,
    total: 0,
    statusFilter: null,

    fetchTickets: async (page = get().page, statusFilter = get().statusFilter) => {
        set({ isLoading: true, error: null });
        try {
            const { tickets, total } = await ticketService.list(page, statusFilter);
            set({ tickets, total, page, statusFilter });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load tickets" });
        } finally {
            set({ isLoading: false });
        }
    },
}));