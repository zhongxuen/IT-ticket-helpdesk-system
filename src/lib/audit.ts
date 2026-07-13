import { supabaseServer } from "@/lib/supabase/server";

export async function writeAuditLog(input: {
    userId: string | null;
    action: string;
    tableName?: string;
    recordId?: string;
    metadata?: Record<string, unknown>;
}) {
    await supabaseServer.from("audit_logs").insert({
        user_id: input.userId,
        action: input.action,
        table_name: input.tableName ?? null,
        record_id: input.recordId ?? null,
        metadata: input.metadata ?? {},
    });
}