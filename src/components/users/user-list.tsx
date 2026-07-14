"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export function UserList() {
    const actorId = useAuthStore((s) => s.profile?.id);
    const { users, isLoading, error, page, pageSize, total, fetchUsers, setUserActive } = useUserStore();
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    const toggleActive = async (id: string, isActive: boolean) => {
        if (!actorId) return;
        setPendingId(id);
        try {
            await setUserActive(id, !isActive, actorId);
        } finally {
            setPendingId(null);
        }
    };

    if (isLoading) return <p className="text-muted-foreground">Loading users...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (users.length === 0) return <p className="text-muted-foreground">No users found.</p>;

    return (
        <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-left">
                        <tr>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Name</th>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Email</th>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Role</th>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Status</th>
                            <th className="px-4 py-3 font-medium" />
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-border transition-colors hover:bg-primary/5">
                                <td className="px-4 py-2">{user.fullName}</td>
                                <td className="px-4 py-2 text-muted-foreground">{user.email}</td>
                                <td className="px-4 py-2 capitalize">{user.role}</td>
                                <td className="px-4 py-2">
                                    <span className={user.isActive ? "text-green-700" : "text-muted-foreground"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pendingId === user.id || !actorId}
                                        onClick={() => toggleActive(user.id, user.isActive)}
                                    >
                                        {user.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={fetchUsers} />
        </div>
    );
}