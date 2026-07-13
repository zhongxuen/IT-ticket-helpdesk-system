"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { ticketService } from "@/services/ticket.service";
import { ROLES } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Profile } from "@/types/profile";
import type { Ticket } from "@/types/ticket";

interface TicketAssignProps {
    ticket: Ticket;
    changedBy: string;
    onAssigned: (assignedItId: string | null, assignedTechnicianId: string | null) => void;
}

export function TicketAssign({ ticket, changedBy, onAssigned }: TicketAssignProps) {
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assignedItId, setAssignedItId] = useState(ticket.assignedItId ?? "");
    const [assignedTechnicianId, setAssignedTechnicianId] = useState(ticket.assignedTechnicianId ?? "");

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        userService
            .listAll()
            .then((result) => {
                if (active) setUsers(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load users");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const itUsers = users.filter((u) => u.role === ROLES.IT);
    const technicianUsers = users.filter((u) => u.role === ROLES.TECHNICIAN);

    const handleSave = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await ticketService.assign(
                ticket.id,
                { assignedItId: assignedItId || null, assignedTechnicianId: assignedTechnicianId || null },
                changedBy
            );
            onAssigned(assignedItId || null, assignedTechnicianId || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to assign ticket");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading assignees...</p>;

    return (
        <div className="space-y-3 rounded-md border border-border p-3">
            <div className="space-y-2">
                <Label htmlFor="assignedItId">IT</Label>
                <Select id="assignedItId" value={assignedItId} onChange={(e) => setAssignedItId(e.target.value)}>
                    <option value="">Unassigned</option>
                    {itUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.fullName}
                        </option>
                    ))}
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="assignedTechnicianId">Technician</Label>
                <Select id="assignedTechnicianId" value={assignedTechnicianId} onChange={(e) => setAssignedTechnicianId(e.target.value)}>
                    <option value="">Unassigned</option>
                    {technicianUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.fullName}
                        </option>
                    ))}
                </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save assignment"}
            </Button>
        </div>
    );
}