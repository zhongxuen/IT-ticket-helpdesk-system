import { create } from "zustand";
import type { Profile } from "@/types/profile";
import { userService } from "@/services/user.service";
import type { CreateUserFormValues } from "@/validations/user.schema";

interface UserState {
    users: Profile[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    createUser: (input: CreateUserFormValues) => Promise<void>;
    setUserActive: (id: string, isActive: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const users = await userService.list();
            set({ users });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load users" });
        } finally {
            set({ isLoading: false });
        }
    },

    createUser: async (input) => {
        const profile = await userService.create(input);
        set({ users: [profile, ...get().users] });
    },

    setUserActive: async (id, isActive) => {
        const updated = await userService.setActive(id, isActive);
        set({ users: get().users.map((u) => (u.id === id ? updated : u)) });
    },
}));