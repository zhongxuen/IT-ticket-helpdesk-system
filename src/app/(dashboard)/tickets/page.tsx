import Link from "next/link";
import { TicketList } from "@/components/tickets/ticket-list";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function TicketsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Tickets</h1>
                <Link href={ROUTES.TICKETS_NEW}>
                    <Button>New Ticket</Button>
                </Link>
            </div>
            <TicketList />
        </div>
    );
}