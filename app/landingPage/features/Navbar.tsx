"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Benefits", href: "#benefits" },
        { name: "Testimonials", href: "#testimonials" },
    ]

    return (
        <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-pastel-blue to-pastel-purple bg-clip-text text-transparent">
                            ServiScore
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <ModeToggle />
                    <Link href="/login">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden items-center gap-2">
                    <ModeToggle />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="flex flex-col gap-2 mt-4">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
