import { supabase } from "@/lib/supabase/client";
import type { Ticket, TicketHistoryEntry } from "@/types/ticket";
import type { TicketStatus } from "@/types/database";

function mapTicket(row: any): Ticket {
    return {
        id: row.id,
        ticketNumber: row.ticket_number,
        title: row.title,
        description: row.description,
        status: row.status,
        employeeId: row.employee_id,
        assignedItId: row.assigned_it_id,
        assignedTechnicianId: row.assigned_technician_id,
        categoryId: row.category_id,
        previousTicketId: row.previous_ticket_id,
        firstReviewedAt: row.first_reviewed_at,
        resolvedAt: row.resolved_at,
        closedAt: row.closed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapHistory(row: any): TicketHistoryEntry {
    return {
        id: row.id,
        ticketId: row.ticket_id,
        changedBy: row.changed_by,
        fieldName: row.field_name,
        oldValue: row.old_value,
        newValue: row.new_value,
        createdAt: row.created_at,
    };
}

export const ticketService = {
    async list(): Promise<Ticket[]> {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []).map(mapTicket);
    },

    async getById(id: string): Promise<Ticket | null> {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }
        return mapTicket(data);
    },

    async create(input: { title: string; description: string; employeeId: string; categoryId?: string | null }): Promise<Ticket> {
        const { data, error } = await supabase
            .from("tickets")
            .insert({
                title: input.title,
                description: input.description,
                employee_id: input.employeeId,
                category_id: input.categoryId ?? null,
            })
            .select("*")
            .single();

        if (error) throw error;
        return mapTicket(data);
    },

    async updateStatus(id: string, newStatus: TicketStatus, changedBy: string): Promise<Ticket> {
        const current = await this.getById(id);
        if (!current) throw new Error("Ticket not found");

        const timestampField: Record<string, string> = {
            resolved: "resolved_at",
            closed: "closed_at",
        };

        const updatePayload: Record<string, unknown> = { status: newStatus };
        if (timestampField[newStatus]) {
            updatePayload[timestampField[newStatus]] = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("tickets")
            .update(updatePayload)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;

        const { error: historyError } = await supabase.from("ticket_history").insert({
            ticket_id: id,
            changed_by: changedBy,
            field_name: "status",
            old_value: current.status,
            new_value: newStatus,
        });

        if (historyError) throw historyError;

        return mapTicket(data);
    },

    async getHistory(ticketId: string): Promise<TicketHistoryEntry[]> {
        const { data, error } = await supabase
            .from("ticket_history")
            .select("*")
            .eq("ticket_id", ticketId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []).map(mapHistory);
    },
};