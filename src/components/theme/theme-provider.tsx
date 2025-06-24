'use client';
import { ThemeProvider as BaseThemeProvider } from "next-themes";

type ThemeProviderProps = {
    children: React.ReactNode;
};

const ThemeProvider = ({children}: ThemeProviderProps)=> {
    return (
        <BaseThemeProvider attribute="class" defaultTheme="system" enableColorScheme>
            {children}
        </BaseThemeProvider>
    )
};

export {ThemeProvider};