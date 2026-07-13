import { create } from "zustand";
import type { TicketCategory } from "@/types/category";
import { categoryService } from "@/services/category.service";
import type { CategoryFormValues } from "@/validations/category.schema";
import { APP_CONFIG } from "@/config/app";

interface CategoryState {
    categories: TicketCategory[];
    isLoading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    total: number;
    fetchCategories: (page?: number) => Promise<void>;
    createCategory: (input: CategoryFormValues) => Promise<void>;
    updateCategory: (id: string, input: CategoryFormValues) => Promise<void>;
    setCategoryActive: (id: string, isActive: boolean) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,
    page: 1,
    pageSize: APP_CONFIG.pagination,
    total: 0,

    fetchCategories: async (page = get().page) => {
        set({ isLoading: true, error: null });
        try {
            const { categories, total } = await categoryService.list(page);
            set({ categories, total, page });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load categories" });
        } finally {
            set({ isLoading: false });
        }
    },

    createCategory: async (input) => {
        await categoryService.create(input);
        await get().fetchCategories(1);
    },

    updateCategory: async (id, input) => {
        const updated = await categoryService.update(id, input);
        set({ categories: get().categories.map((c) => (c.id === id ? updated : c)) });
    },

    setCategoryActive: async (id, isActive) => {
        const updated = await categoryService.setActive(id, isActive);
        set({ categories: get().categories.map((c) => (c.id === id ? updated : c)) });
    },
}));