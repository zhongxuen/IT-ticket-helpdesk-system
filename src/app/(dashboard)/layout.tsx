"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { ROUTES } from "@/constants/routes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { profile, isInitialized, isLoading, loadProfile } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized && !isLoading) {
            loadProfile();
        }
    }, [isInitialized, isLoading, loadProfile]);

    useEffect(() => {
        if (isInitialized && !profile) {
            router.replace(ROUTES.LOGIN);
        }
    }, [isInitialized, profile, router]);

    if (!isInitialized || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="flex min-h-screen">
            <Sidebar role={profile.role} />
            <div className="flex flex-1 flex-col">
                <Navbar profile={profile} />
                <main className="flex-1 animate-slide-up p-6">{children}</main>
            </div>
        </div>
    );
}