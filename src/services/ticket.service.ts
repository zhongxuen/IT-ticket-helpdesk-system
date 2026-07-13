import { supabase } from "@/lib/supabase/client";
import { emailNotificationService } from "@/services/email-notification.service";
import { APP_CONFIG } from "@/config/app";
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
        changedByName: row.profiles?.full_name ?? null,
        fieldName: row.field_name,
        oldValue: row.old_value,
        newValue: row.new_value,
        createdAt: row.created_at,
    };
}

export const ticketService = {
    async list(page = 1): Promise<{ tickets: Ticket[]; total: number }> {
        const from = (page - 1) * APP_CONFIG.pagination;
        const to = from + APP_CONFIG.pagination - 1;

        const { data, error, count } = await supabase
            .from("tickets")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { tickets: (data ?? []).map(mapTicket), total: count ?? 0 };
    },

    async getById(id: string): Promise<Ticket | null> {
        const { data, error } = await supabase.from("tickets").select("*").eq("id", id).single();

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
        const created = mapTicket(data);

        emailNotificationService.queue({
            ticketId: created.id,
            recipientId: created.employeeId,
            subject: `Ticket #${created.ticketNumber} created`,
            body: `Your ticket "${created.title}" has been submitted.`,
        });

        return created;
    },

    async reopen(ticketId: string, employeeId: string): Promise<Ticket> {
        const original = await this.getById(ticketId);
        if (!original) throw new Error("Ticket not found");

        const { data, error } = await supabase
            .from("tickets")
            .insert({
                title: original.title,
                description: original.description,
                employee_id: employeeId,
                category_id: original.categoryId ?? null,
                previous_ticket_id: original.id,
            })
            .select("*")
            .single();

        if (error) throw error;
        const created = mapTicket(data);

        emailNotificationService.queue({
            ticketId: created.id,
            recipientId: employeeId,
            subject: `Ticket #${created.ticketNumber} reopened from #${original.ticketNumber}`,
        });

        return created;
    },

    async getPreviousTicket(ticketId: string): Promise<Ticket | null> {
        const ticket = await this.getById(ticketId);
        if (!ticket?.previousTicketId) return null;
        return this.getById(ticket.previousTicketId);
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

        const { data, error } = await supabase.from("tickets").update(updatePayload).eq("id", id).select("*").single();

        if (error) throw error;

        const { error: historyError } = await supabase.from("ticket_history").insert({
            ticket_id: id,
            changed_by: changedBy,
            field_name: "status",
            old_value: current.status,
            new_value: newStatus,
        });

        if (historyError) throw historyError;

        const updated = mapTicket(data);

        emailNotificationService.queue({
            ticketId: updated.id,
            recipientId: updated.employeeId,
            subject: `Ticket #${updated.ticketNumber} status changed to ${newStatus}`,
        });

        return updated;
    },

    async assign(
        id: string,
        input: { assignedItId?: string | null; assignedTechnicianId?: string | null },
        changedBy: string
    ): Promise<Ticket> {
        const current = await this.getById(id);
        if (!current) throw new Error("Ticket not found");

        const updatePayload: Record<string, unknown> = {};
        if (input.assignedItId !== undefined) updatePayload.assigned_it_id = input.assignedItId;
        if (input.assignedTechnicianId !== undefined) updatePayload.assigned_technician_id = input.assignedTechnicianId;

        const { data, error } = await supabase.from("tickets").update(updatePayload).eq("id", id).select("*").single();

        if (error) throw error;

        const historyEntries: Record<string, unknown>[] = [];
        if (input.assignedItId !== undefined && input.assignedItId !== current.assignedItId) {
            historyEntries.push({
                ticket_id: id,
                changed_by: changedBy,
                field_name: "assigned_it_id",
                old_value: current.assignedItId ?? null,
                new_value: input.assignedItId,
            });
        }
        if (input.assignedTechnicianId !== undefined && input.assignedTechnicianId !== current.assignedTechnicianId) {
            historyEntries.push({
                ticket_id: id,
                changed_by: changedBy,
                field_name: "assigned_technician_id",
                old_value: current.assignedTechnicianId ?? null,
                new_value: input.assignedTechnicianId,
            });
        }

        if (historyEntries.length > 0) {
            const { error: historyError } = await supabase.from("ticket_history").insert(historyEntries);
            if (historyError) throw historyError;
        }

        const updated = mapTicket(data);

        if (input.assignedItId && input.assignedItId !== current.assignedItId) {
            emailNotificationService.queue({
                ticketId: updated.id,
                recipientId: input.assignedItId,
                subject: `Ticket #${updated.ticketNumber} assigned to you`,
            });
        }
        if (input.assignedTechnicianId && input.assignedTechnicianId !== current.assignedTechnicianId) {
            emailNotificationService.queue({
                ticketId: updated.id,
                recipientId: input.assignedTechnicianId,
                subject: `Ticket #${updated.ticketNumber} assigned to you`,
            });
        }

        return updated;
    },

    async getHistory(ticketId: string): Promise<TicketHistoryEntry[]> {
        const { data, error } = await supabase
            .from("ticket_history")
            .select("*, profiles:changed_by(full_name)")
            .eq("ticket_id", ticketId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []).map(mapHistory);
    },

    async markFirstReviewed(id: string): Promise<Ticket> {
        const { data, error } = await supabase
            .from("tickets")
            .update({ first_reviewed_at: new Date().toISOString() })
            .eq("id", id)
            .is("first_reviewed_at", null)
            .select("*")
            .single();

        if (error) throw error;
        return mapTicket(data);
    },

    async getSummary(): Promise<{ open: number; pending: number; resolved: number; cancelled: number }> {
        const counts = await Promise.all(
            [["new", "assigned", "in_progress"], ["waiting_employee"], ["resolved", "closed"], ["cancelled"]].map(
                (statuses) =>
                    supabase
                        .from("tickets")
                        .select("*", { count: "exact", head: true })
                        .in("status", statuses)
                        .then(({ count }) => count ?? 0)
            )
        );
        const [open, pending, resolved, cancelled] = counts;
        return { open, pending, resolved, cancelled };
    },
};