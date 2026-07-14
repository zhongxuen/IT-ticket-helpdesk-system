import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";
import { ROUTES } from "@/constants/routes";

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

    async requestPasswordReset(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
        });
        if (error) throw error;
    },

    async updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
    },

    async updateEmail(email: string) {
        const { error } = await supabase.auth.updateUser({ email });
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