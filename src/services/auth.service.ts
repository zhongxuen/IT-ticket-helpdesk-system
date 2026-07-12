import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";

export const authService = {
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentProfile(): Promise<Profile | null> {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            fullName: data.full_name,
            email: data.email,
            role: data.role,
            isActive: data.is_active,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },
};