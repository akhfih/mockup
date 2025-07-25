'use client';
import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    return (
        <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")} variant="outline" size="icon">
            <LucideSun className="h-4 w-4 rotate-0 scale-100 transiton-all dark:-rotate-90 dark:scale-0" />
            <LucideMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 " />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

export { ThemeSwitcher }