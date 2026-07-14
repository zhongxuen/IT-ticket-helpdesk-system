import { create } from "zustand";
import type { Profile } from "@/types/profile";
import { userService } from "@/services/user.service";
import type { CreateUserFormValues } from "@/validations/user.schema";
import { APP_CONFIG } from "@/config/app";

interface UserState {
    users: Profile[];
    isLoading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    total: number;
    fetchUsers: (page?: number) => Promise<void>;
    createUser: (input: CreateUserFormValues, actorId: string) => Promise<void>;
    setUserActive: (id: string, isActive: boolean, actorId: string) => Promise<void>;
    updateUserRole: (id: string, role: Profile["role"], actorId: string) => Promise<void>;
    deleteUser: (id: string, actorId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    page: 1,
    pageSize: APP_CONFIG.pagination,
    total: 0,

    fetchUsers: async (page = get().page) => {
        set({ isLoading: true, error: null });
        try {
            const { users, total } = await userService.list(page);
            set({ users, total, page });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load users" });
        } finally {
            set({ isLoading: false });
        }
    },

    createUser: async (input, actorId) => {
        await userService.create(input, actorId);
        await get().fetchUsers(1);
    },

    setUserActive: async (id, isActive, actorId) => {
        const updated = await userService.setActive(id, isActive, actorId);
        set({ users: get().users.map((u) => (u.id === id ? updated : u)) });
    },

    updateUserRole: async (id, role, actorId) => {
        const updated = await userService.updateRole(id, role, actorId);
        set({ users: get().users.map((u) => (u.id === id ? updated : u)) });
    },

    deleteUser: async (id, actorId) => {
        await userService.delete(id, actorId);
        set({ users: get().users.filter((u) => u.id !== id) });
    },
}));