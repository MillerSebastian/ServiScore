"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ActiveThemeContextType = {
    activeTheme: string | undefined;
    setActiveTheme: (theme: string) => void;
};

const ActiveThemeContext = createContext<ActiveThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
    children,
    initialTheme,
}: {
    children: React.ReactNode;
    initialTheme?: string;
}) {
    const [activeTheme, setActiveThemeState] = useState<string | undefined>(initialTheme);

    useEffect(() => {
        if (initialTheme) {
            setActiveThemeState(initialTheme);
        }
    }, [initialTheme]);

    const setActiveTheme = (theme: string) => {
        setActiveThemeState(theme);
        // Set cookie for persistence
        document.cookie = `active-theme=${theme}; path=/; max-age=31536000`; // 1 year
    };

    return (
        <ActiveThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
            {children}
        </ActiveThemeContext.Provider>
    );
}

export function useActiveTheme() {
    const context = useContext(ActiveThemeContext);
    if (context === undefined) {
        throw new Error("useActiveTheme must be used within an ActiveThemeProvider");
    }
    return context;
}
