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
    fetchTickets: (page?: number) => Promise<void>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
    tickets: [],
    isLoading: false,
    error: null,
    page: 1,
    pageSize: APP_CONFIG.pagination,
    total: 0,

    fetchTickets: async (page = get().page) => {
        set({ isLoading: true, error: null });
        try {
            const { tickets, total } = await ticketService.list(page);
            set({ tickets, total, page });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load tickets" });
        } finally {
            set({ isLoading: false });
        }
    },
}));