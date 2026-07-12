"use client";

import { useAuthStore } from "@/stores/auth.store";

export default function ProfilePage() {
    const profile = useAuthStore((s) => s.profile);

    if (!profile) return null;

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-sm text-muted-foreground">{profile.fullName}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground">Role: {profile.role}</p>
        </div>
    );
}