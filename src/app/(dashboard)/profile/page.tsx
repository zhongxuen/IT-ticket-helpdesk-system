"use client";

import { useAuthStore } from "@/stores/auth.store";
import { ProfileInfoForm } from "@/components/profile/profile-info-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export default function ProfilePage() {
    const profile = useAuthStore((s) => s.profile);

    if (!profile) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-sm capitalize text-muted-foreground">Role: {profile.role}</p>
            <div className="grid gap-6 lg:grid-cols-2">
                <ProfileInfoForm profile={profile} />
                <ChangePasswordForm />
            </div>
        </div>
    );
}