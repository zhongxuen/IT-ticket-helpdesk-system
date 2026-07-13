import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.isActive !== "boolean") {
        return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("profiles")
        .update({ is_active: body.isActive })
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await writeAuditLog({
        userId: typeof body.actorId === "string" ? body.actorId : null,
        action: body.isActive ? "user.activate" : "user.deactivate",
        tableName: "profiles",
        recordId: id,
    });

    return NextResponse.json(data);
}