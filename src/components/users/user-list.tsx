"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@/components/ui/button";

export function UserList() {
    const { users, isLoading, error, fetchUsers, setUserActive } = useUserStore();
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleActive = async (id: string, isActive: boolean) => {
        setPendingId(id);
        try {
            await setUserActive(id, !isActive);
        } finally {
            setPendingId(null);
        }
    };

    if (isLoading) {
        return <p className="text-muted-foreground">Loading users...</p>;
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }

    if (users.length === 0) {
        return <p className="text-muted-foreground">No users found.</p>;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                    <tr>
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Role</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium" />
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t border-border hover:bg-muted/30">
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
                                    disabled={pendingId === user.id}
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
    );
}