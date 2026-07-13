interface QueueEmailInput {
    ticketId?: string | null;
    recipientId?: string | null;
    subject: string;
    body?: string;
}

export const emailNotificationService = {
    async queue(input: QueueEmailInput): Promise<void> {
        try {
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId: input.ticketId ?? null,
                    recipientId: input.recipientId ?? null,
                    subject: input.subject,
                    notificationBody: input.body ?? null,
                }),
            });
        } catch {
            // best-effort; a failed notification should not block the caller's action
        }
    },
};