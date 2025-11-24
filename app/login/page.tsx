"use client"

import { Checkbox } from "@/components/ui/checkbox"
import Link from "@/components/ui/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="container mx-auto px-4 py-8 max-w-md animate-in slide-in-from-bottom-4 duration-700 ">
                <div className="bg-card text-card-foreground rounded-3xl shadow-soft border border-border/50 overflow-hidden p-8">
                    <h1 className="text-2xl font-bold mb-6">Login</h1>
                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); router.push("/"); }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example@gmail.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="flex justify-between items-center text-sm">
                                Remenber account section
                                <Checkbox id="fun" name="example" value="1" defaultChecked />
                            </label>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <Link href="register">Don't have an account?</Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
                <div/>
            </div>
        </div>
    )
}