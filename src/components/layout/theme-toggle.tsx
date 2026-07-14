"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme.store";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { isDark, toggleTheme, initTheme } = useThemeStore();

    useEffect(() => {
        initTheme();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDark ? "☀️" : "🌙"}
        </Button>
    );
}