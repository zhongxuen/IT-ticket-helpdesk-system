"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { ROLES } from "@/constants/roles";
import type { UserRole } from "@/types/database";

const ROLE_OPTIONS = [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE];

export function UserList() {
    const actorId = useAuthStore((s) => s.profile?.id);
    const { users, isLoading, error, page, pageSize, total, fetchUsers, setUserActive, updateUserRole, deleteUser } =
        useUserStore();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    const toggleActive = async (id: string, isActive: boolean) => {
        if (!actorId) return;
        setPendingId(id);
        setActionError(null);
        try {
            await setUserActive(id, !isActive, actorId);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setPendingId(null);
        }
    };

    const changeRole = async (id: string, role: UserRole) => {
        if (!actorId) return;
        setPendingId(id);
        setActionError(null);
        try {
            await updateUserRole(id, role, actorId);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to update role");
        } finally {
            setPendingId(null);
        }
    };

    const removeUser = async (id: string) => {
        if (!actorId) return;
        if (!window.confirm("Delete this user permanently?")) return;
        setPendingId(id);
        setActionError(null);
        try {
            await deleteUser(id, actorId);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to delete user");
        } finally {
            setPendingId(null);
        }
    };

    if (isLoading) return <p className="text-muted-foreground">Loading users...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (users.length === 0) return <p className="text-muted-foreground">No users found.</p>;

    return (
        <div className="space-y-3">
            {actionError && <p className="text-sm text-destructive">{actionError}</p>}
            <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
                <table className="w-full min-w-140 text-sm">
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
                                <td className="px-4 py-2 text-foreground">{user.fullName}</td>
                                <td className="px-4 py-2 text-muted-foreground">{user.email}</td>
                                <td className="px-4 py-2">
                                    <Select
                                        value={user.role}
                                        disabled={pendingId === user.id || !actorId || user.id === actorId}
                                        onChange={(e) => changeRole(user.id, e.target.value as UserRole)}
                                    >
                                        {ROLE_OPTIONS.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </Select>
                                </td>
                                <td className="px-4 py-2">
                                    <span className={user.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pendingId === user.id || !actorId}
                                        onClick={() => toggleActive(user.id, user.isActive)}
                                    >
                                        {user.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={pendingId === user.id || !actorId || user.id === actorId}
                                        onClick={() => removeUser(user.id)}
                                    >
                                        Delete
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