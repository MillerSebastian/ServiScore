"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Clock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    if (!time) {
        return null; // Avoid hydration mismatch
    }

    return (
        <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
