"use client";

import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { ActiveThemeProvider } from "@/app/dashboard/components/active-theme"

const META_THEME_COLOR = {
    light: "#ffffff",
    dark: "#000000",
}

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
            <div>
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const activeThemeValue = cookieStore.get("active-theme")?.value
    const isScaled = activeThemeValue?.endsWith("-scaled");
    return (
        <ActiveThemeProvider initialTheme={activeThemeValue}>

        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
        </ActiveThemeProvider >
    );
}
