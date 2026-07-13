import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";
import type { CreateUserFormValues } from "@/validations/user.schema";
import { APP_CONFIG } from "@/config/app";

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

export const userService = {
    async list(page = 1): Promise<{ users: Profile[]; total: number }> {
        const from = (page - 1) * APP_CONFIG.pagination;
        const to = from + APP_CONFIG.pagination - 1;

        const { data, error, count } = await supabase
            .from("profiles")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { users: (data ?? []).map(mapProfile), total: count ?? 0 };
    },

    async listAll(): Promise<Profile[]> {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []).map(mapProfile);
    },

    async create(input: CreateUserFormValues, actorId: string): Promise<Profile> {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...input, actorId }),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? "Failed to create user");
        }

        return mapProfile(await res.json());
    },

    async setActive(id: string, isActive: boolean, actorId: string): Promise<Profile> {
        const res = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive, actorId }),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? "Failed to update user");
        }

        return mapProfile(await res.json());
    },
};