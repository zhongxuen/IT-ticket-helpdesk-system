import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";
import type { CreateUserFormValues } from "@/validations/user.schema";

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
    async list(): Promise<Profile[]> {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []).map(mapProfile);
    },

    async create(input: CreateUserFormValues): Promise<Profile> {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? "Failed to create user");
        }

        return mapProfile(await res.json());
    },

    async setActive(id: string, isActive: boolean): Promise<Profile> {
        const res = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive }),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? "Failed to update user");
        }

        return mapProfile(await res.json());
    },
};