import { TicketForm } from "@/components/tickets/ticket-form";

export default function NewTicketPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">New Ticket</h1>
            <TicketForm />
        </div>
    );
}