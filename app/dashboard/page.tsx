"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import PageMeta from "./components/common/PageMeta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ShoppingBag, Users } from "lucide-react";
import { MonthlyLineChart, ActivityRadarChart, ScatterChart } from "./components/Charts";
import Clock from "./components/common/Clock";

export default function DashboardPage() {
    const { items: stores } = useSelector((state: RootState) => state.stores);
    const { items: services } = useSelector((state: RootState) => state.services);
    const { user } = useSelector((state: RootState) => state.auth);

    const stats = [
        {
            title: "Total Stores",
            value: stores.length,
            icon: Store,
            description: "Active stores on platform",
        },
        {
            title: "Total Services",
            value: services.length,
            icon: ShoppingBag,
            description: "Available services",
        },
        {
            title: "Active Users",
            value: "1", // Mock for now as we only have auth user
            icon: Users,
            description: "Currently online",
        },
    ];

    return (
        <>
            <PageMeta
                title="ServiScore Dashboard"
                description="ServiScore Admin Dashboard"
            />
            <div className="space-y-6">
                <Clock />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Stores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {stores.slice(0, 5).map((store) => (
                                    <div key={store.id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            <img src={store.image || "/placeholder.svg"} alt={store.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{store.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {store.category}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {store.rating} ★
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {services.slice(0, 5).map((service) => (
                                    <div key={service.id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            <img src={service.creatorAvatar || "/placeholder.svg"} alt={service.creatorName} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{service.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                ${service.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Monthly Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <MonthlyLineChart />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Activity Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityRadarChart />
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Scatter Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScatterChart />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
