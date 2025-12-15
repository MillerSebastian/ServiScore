"use client";

import { useSidebar } from "@/components/ui/sidebar";

export function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { state, openMobile } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
            <div>
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${state === "expanded" ? "lg:ml-[290px]" : "lg:ml-[90px]"} ${openMobile ? "ml-0" : ""}`}
            >
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
