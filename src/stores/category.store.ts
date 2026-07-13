import { create } from "zustand";
import type { TicketCategory } from "@/types/category";
import { categoryService } from "@/services/category.service";
import type { CategoryFormValues } from "@/validations/category.schema";

interface CategoryState {
    categories: TicketCategory[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    createCategory: (input: CategoryFormValues) => Promise<void>;
    updateCategory: (id: string, input: CategoryFormValues) => Promise<void>;
    setCategoryActive: (id: string, isActive: boolean) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const categories = await categoryService.list();
            set({ categories });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Failed to load categories" });
        } finally {
            set({ isLoading: false });
        }
    },

    createCategory: async (input) => {
        const category = await categoryService.create(input);
        set({ categories: [category, ...get().categories] });
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