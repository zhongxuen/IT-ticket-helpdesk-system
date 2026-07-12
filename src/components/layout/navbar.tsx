"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/profile";
import { ROUTES } from "@/constants/routes";

interface NavbarProps {
    profile: Profile;
}

export function Navbar({ profile }: NavbarProps) {
    const router = useRouter();
    const signOut = useAuthStore((s) => s.signOut);

    const handleSignOut = async () => {
        await signOut();
        router.push(ROUTES.LOGIN);
        router.refresh();
    };

    return (
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
            <span className="text-sm text-muted-foreground">{profile.fullName}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
            </Button>
        </header>
    );
}