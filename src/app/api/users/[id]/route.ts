import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";
import { updateUserRoleSchema } from "@/validations/user.schema";

async function assertAdmin(actorId: unknown): Promise<boolean> {
    if (typeof actorId !== "string") return false;
    const { data, error } = await supabaseServer
        .from("profiles")
        .select("role")
        .eq("id", actorId)
        .single();
    if (error || !data) return false;
    return data.role === "admin";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    if (!(await assertAdmin(body.actorId))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatePayload: Record<string, unknown> = {};
    let auditAction: string | null = null;
    let auditMetadata: Record<string, unknown> = {};

    if (typeof body.isActive === "boolean") {
        updatePayload.is_active = body.isActive;
        auditAction = body.isActive ? "user.activate" : "user.deactivate";
    }

    if (body.role !== undefined) {
        const parsed = updateUserRoleSchema.safeParse({ role: body.role });
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid role" }, { status: 400 });
        }
        if (id === body.actorId) {
            return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
        }
        updatePayload.role = parsed.data.role;
        auditAction = "user.role_change";
        auditMetadata = { newRole: parsed.data.role };
    }

    if (Object.keys(updatePayload).length === 0) {
        return NextResponse.json({ error: "No changes provided" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("profiles")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (auditAction) {
        await writeAuditLog({
            userId: typeof body.actorId === "string" ? body.actorId : null,
            action: auditAction,
            tableName: "profiles",
            recordId: id,
            metadata: auditMetadata,
        });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    if (!(await assertAdmin(body.actorId))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (id === body.actorId) {
        return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const { error: profileError } = await supabaseServer.from("profiles").delete().eq("id", id);
    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { error: authError } = await supabaseServer.auth.admin.deleteUser(id);
    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    await writeAuditLog({
        userId: typeof body.actorId === "string" ? body.actorId : null,
        action: "user.delete",
        tableName: "profiles",
        recordId: id,
    });

    return NextResponse.json({ success: true });
}