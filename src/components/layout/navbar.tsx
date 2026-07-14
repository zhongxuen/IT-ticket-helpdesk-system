"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Profile } from "@/types/profile";
import { ROUTES } from "@/constants/routes";

interface NavbarProps {
    profile: Profile;
}

export function Navbar({ profile }: NavbarProps) {
    const signOut = useAuthStore((s) => s.signOut);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        try {
            await signOut();
        } finally {
            window.location.href = ROUTES.LOGIN;
        }
    };

    return (
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
            <span className="text-sm font-medium text-foreground">{profile.fullName}</span>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
            </div>
        </header>
    );
}