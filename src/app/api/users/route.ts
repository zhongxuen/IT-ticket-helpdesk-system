import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { createUserSchema } from "@/validations/user.schema";
import { writeAuditLog } from "@/lib/audit";

export async function POST(request: Request) {
    const body = await request.json();
    const { actorId, ...userInput } = body;
    const parsed = createUserSchema.safeParse(userInput);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { fullName, email, password, role } = parsed.data;

    const { data: created, error: createError } = await supabaseServer.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (createError || !created.user) {
        return NextResponse.json({ error: createError?.message ?? "Failed to create auth user" }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabaseServer
        .from("profiles")
        .insert({ id: created.user.id, full_name: fullName, email, role })
        .select("*")
        .single();

    if (profileError) {
        await supabaseServer.auth.admin.deleteUser(created.user.id);
        return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    await writeAuditLog({
        userId: typeof actorId === "string" ? actorId : null,
        action: "user.create",
        tableName: "profiles",
        recordId: created.user.id,
        metadata: { role },
    });

    return NextResponse.json(profile, { status: 201 });
}