import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            isDark: false,
            toggleTheme: () => {
                const next = !get().isDark;
                document.documentElement.classList.toggle("dark", next);
                set({ isDark: next });
            },
            initTheme: () => {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const isDark = get().isDark ?? prefersDark;
                document.documentElement.classList.toggle("dark", isDark);
                set({ isDark });
            },
        }),
        { name: "theme-storage" }
    )
);