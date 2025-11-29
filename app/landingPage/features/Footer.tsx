"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-pastel-blue to-pastel-purple bg-clip-text text-transparent">
                                ServiScore
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering businesses to deliver world-class service through data-driven insights and automation.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-primary transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for the latest updates and tips.
                        </p>
                        <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-background"
                            />
                            <Button type="submit" size="icon" className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Subscribe</span>
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ServiScore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
