import { create } from "zustand";
import type { Profile } from "@/types/profile";
import { authService } from "@/services/auth.service";

interface AuthState {
    profile: Profile | null;
    isLoading: boolean;
    isInitialized: boolean;
    setProfile: (profile: Profile | null) => void;
    loadProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    profile: null,
    isLoading: false,
    isInitialized: false,

    setProfile: (profile) => set({ profile }),

    loadProfile: async () => {
        set({ isLoading: true });
        try {
            const profile = await authService.getCurrentProfile();
            set({ profile, isInitialized: true });
        } finally {
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        await authService.signOut();
        set({ profile: null });
    },
}));