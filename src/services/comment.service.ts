import { supabase } from "@/lib/supabase/client";
import type { TicketComment } from "@/types/comment";
import type { CommentVisibility } from "@/types/database";

const COMMENT_SELECT = "*, profiles:profiles!author_id(full_name)";

function mapComment(row: any): TicketComment {
    return {
        id: row.id,
        ticketId: row.ticket_id,
        authorId: row.author_id,
        authorName: row.profiles?.full_name ?? "Unknown",
        visibility: row.visibility,
        comment: row.comment,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const commentService = {
    async listByTicket(ticketId: string): Promise<TicketComment[]> {
        const { data, error } = await supabase
            .from("ticket_comments")
            .select(COMMENT_SELECT)
            .eq("ticket_id", ticketId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return (data ?? []).map(mapComment);
    },

    async create(input: {
        ticketId: string;
        authorId: string;
        comment: string;
        visibility: CommentVisibility;
    }): Promise<TicketComment> {
        const { data, error } = await supabase
            .from("ticket_comments")
            .insert({
                ticket_id: input.ticketId,
                author_id: input.authorId,
                comment: input.comment,
                visibility: input.visibility,
            })
            .select(COMMENT_SELECT)
            .single();

        if (error) throw error;
        return mapComment(data);
    },
};