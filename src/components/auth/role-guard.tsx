"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import type { UserRole } from "@/types/database";
import { ROUTES } from "@/constants/routes";

interface RoleGuardProps {
    allowed: UserRole[];
    children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
    const profile = useAuthStore((s) => s.profile);
    const router = useRouter();

    useEffect(() => {
        if (profile && !allowed.includes(profile.role)) {
            router.replace(ROUTES.DASHBOARD);
        }
    }, [profile, allowed, router]);

    if (!profile) return null;

    if (!allowed.includes(profile.role)) {
        return <p className="text-muted-foreground">You don&apos;t have permission to view this page.</p>;
    }

    return <>{children}</>;
}