import { supabase } from "@/lib/supabase/client";
import type { SystemSettings } from "@/types/settings";

function mapSettings(row: any): SystemSettings {
    return {
        companyName: row.company_name ?? "",
        supportEmail: row.support_email ?? "",
        updatedAt: row.updated_at,
    };
}

export const settingsService = {
    async get(): Promise<SystemSettings | null> {
        const { data, error } = await supabase
            .from("system_settings")
            .select("*")
            .eq("id", true)
            .single();

        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }
        return mapSettings(data);
    },

    async update(input: { companyName: string; supportEmail: string }): Promise<SystemSettings> {
        const { data, error } = await supabase
            .from("system_settings")
            .upsert({
                id: true,
                company_name: input.companyName,
                support_email: input.supportEmail,
                updated_at: new Date().toISOString(),
            })
            .select("*")
            .single();

        if (error) throw error;
        return mapSettings(data);
    },
};