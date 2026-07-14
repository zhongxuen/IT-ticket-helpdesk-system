"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Profile } from "@/types/profile";
import { ROUTES } from "@/constants/routes";

interface NavbarProps {
    profile: Profile;
    onMenuClick: () => void;
}

export function Navbar({ profile, onMenuClick }: NavbarProps) {
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
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="select-none rounded-md p-2 text-foreground/70 hover:bg-muted hover:text-primary md:hidden"
                >
                    ☰
                </button>
                <span className="truncate text-sm font-medium text-foreground">{profile.fullName}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
            </div>
        </header>
    );
}