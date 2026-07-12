import { create } from "zustand";
import type { Ticket } from "@/types/ticket";
import { ticketService } from "@/services/ticket.service";

interface TicketState {
    tickets: Ticket[];
    isLoading: boolean;
    error: string | null;
    fetchTickets: () => Promise<void>;
}

export const useTicketStore = create<TicketState>((set) => ({
    tickets: [],
    isLoading: false,
    error: null,

    fetchTickets: async () => {
        set({ isLoading: true, error: null });
        try {
            const tickets = await ticketService.list();
            set({ tickets });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load tickets" });
        } finally {
            set({ isLoading: false });
        }
    },
}));