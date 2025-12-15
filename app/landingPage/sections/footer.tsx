"use client"

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
    const { t } = useLanguage()
    
    return (
        <footer className="bg-secondary py-12 border-t">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1">
                        <h2 className="text-2xl font-bold mb-4">ServiScore</h2>
                        <p className="text-muted-foreground max-w-sm">
                            {t("footer.description")}
                        </p>
                    </div>

                    {/* Team / Credits */}
                    <div className="col-span-1">
                        <div className="mb-4">
                            <Image
                                src="/landindPictures/Logo_White_Riwi.svg"
                                alt="Riwi Logo"
                                width={100}
                                height={40}
                                className="mb-2"
                            />
                            <p className="text-sm text-muted-foreground font-medium">
                                {t("footer.createdBy")}
                            </p>
                        </div>
                        <ul className="space-y-1 text-sm text-muted-foreground/70">
                            <li>Sebastian Rodelo - Product Owner</li>
                            <li>Santiago Lopez - Frontend Developer</li>
                            <li>Maria Almeira - Backend Developer</li>
                            <li>Kelmin Martinez - Backend Developer</li>
                            <li>Keshia - Scrum Master</li>
                            <li>Alex - Analista de Datos</li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t("footer.platform")}</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.features")}</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.pricing")}</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.aboutUs")}</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t("footer.legal")}</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.privacyPolicy")}</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.termsOfService")}</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">{t("footer.cookiePolicy")}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
                    <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} ServiScore. {t("footer.allRightsReserved")}
                    </p>
                    <div className="flex space-x-6">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Facebook size={20} />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter size={20} />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram size={20} />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}