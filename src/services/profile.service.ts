import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";

function mapProfile(row: any): Profile {
    return {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const profileService = {
    async updateFullName(id: string, fullName: string): Promise<Profile> {
        const { data, error } = await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return mapProfile(data);
    },
};