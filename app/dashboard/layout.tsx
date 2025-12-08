import { cookies } from "next/headers";
import { SidebarProvider } from "./context/SidebarContext";
import { ActiveThemeProvider } from "@/app/dashboard/components/active-theme";
import { DashboardLayoutContent } from "./components/DashboardLayoutContent";

const META_THEME_COLOR = {
    light: "#ffffff",
    dark: "#000000",
}

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
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </SidebarProvider>
        </ActiveThemeProvider>
    );
}
