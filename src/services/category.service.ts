import { supabase } from "@/lib/supabase/client";
import type { TicketCategory } from "@/types/category";
import type { CategoryFormValues } from "@/validations/category.schema";

function mapCategory(row: any): TicketCategory {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        isActive: row.is_active,
    };
}

export const categoryService = {
    async list(): Promise<TicketCategory[]> {
        const { data, error } = await supabase
            .from("ticket_categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return (data ?? []).map(mapCategory);
    },

    async listActive(): Promise<TicketCategory[]> {
        const { data, error } = await supabase
            .from("ticket_categories")
            .select("*")
            .eq("is_active", true)
            .order("name", { ascending: true });

        if (error) throw error;
        return (data ?? []).map(mapCategory);
    },

    async create(input: CategoryFormValues): Promise<TicketCategory> {
        const { data, error } = await supabase
            .from("ticket_categories")
            .insert({
                name: input.name,
                description: input.description || null,
            })
            .select("*")
            .single();

        if (error) throw error;
        return mapCategory(data);
    },

    async update(id: string, input: CategoryFormValues): Promise<TicketCategory> {
        const { data, error } = await supabase
            .from("ticket_categories")
            .update({
                name: input.name,
                description: input.description || null,
            })
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return mapCategory(data);
    },

    async setActive(id: string, isActive: boolean): Promise<TicketCategory> {
        const { data, error } = await supabase
            .from("ticket_categories")
            .update({ is_active: isActive })
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return mapCategory(data);
    },
};