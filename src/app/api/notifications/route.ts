import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { ticketId, recipientId, subject, notificationBody } = body;

    if (typeof subject !== "string" || subject.length === 0) {
        return NextResponse.json({ error: "subject is required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from("email_notifications")
        .insert({
            ticket_id: ticketId ?? null,
            recipient_id: recipientId ?? null,
            subject,
            body: notificationBody ?? null,
        })
        .select("*")
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}