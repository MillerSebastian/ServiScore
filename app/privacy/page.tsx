"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPolicy() {
    const { language } = useLanguage()
    const isEs = language === "es"
    const lastUpdated = new Date().toLocaleDateString(isEs ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/landingPage">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {isEs ? "Volver al inicio" : "Back to home"}
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-8">
                    {isEs ? "Política de Privacidad" : "Privacy Policy"}
                </h1>
                
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground text-lg">
                        {isEs ? "Última actualización:" : "Last updated:"} {lastUpdated}
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "1. Información que Recopilamos" : "1. Information We Collect"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "En ServiScore, recopilamos información que nos proporcionas directamente cuando te registras en nuestra plataforma, incluyendo nombre, correo electrónico, número de teléfono y datos de ubicación para conectarte con servicios locales."
                                : "At ServiScore, we collect information you provide directly when you register on our platform, including your name, email address, phone number, and location data to connect you with local services."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "2. Uso de la Información" : "2. How We Use Your Information"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? "Utilizamos tu información para:" : "We use your information to:"}
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>
                                {isEs
                                    ? "Facilitar la conexión entre proveedores de servicios y clientes"
                                    : "Facilitate connections between service providers and customers"}
                            </li>
                            <li>{isEs ? "Procesar transacciones y pagos" : "Process transactions and payments"}</li>
                            <li>{isEs ? "Mejorar nuestros servicios y experiencia de usuario" : "Improve our services and user experience"}</li>
                            <li>{isEs ? "Enviarte notificaciones importantes sobre tu cuenta" : "Send you important account notifications"}</li>
                            <li>{isEs ? "Prevenir fraudes y garantizar la seguridad de la plataforma" : "Prevent fraud and keep the platform secure"}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "3. Compartir Información" : "3. Sharing Information"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "No vendemos tu información personal. Compartimos información únicamente cuando es necesario para proporcionar nuestros servicios, con tu consentimiento explícito, o cuando la ley lo requiere."
                                : "We do not sell your personal information. We only share information when necessary to provide our services, with your explicit consent, or when required by law."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "4. Seguridad de Datos" : "4. Data Security"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción."
                                : "We implement technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "5. Tus Derechos" : "5. Your Rights"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Tienes derecho a acceder, corregir, eliminar o limitar el uso de tu información personal. También puedes oponerte al procesamiento de tus datos o solicitar la portabilidad de los mismos."
                                : "You have the right to access, correct, delete, or restrict the use of your personal information. You may also object to the processing of your data or request data portability."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "6. Cookies y Tecnologías Similares" : "6. Cookies and Similar Technologies"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? (
                                <>
                                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma. Consulta nuestra{" "}
                                    <Link href="/cookies" className="text-primary hover:underline">
                                        Política de Cookies
                                    </Link>{" "}
                                    para más información.
                                </>
                            ) : (
                                <>
                                    We use cookies and similar technologies to improve your experience on our platform. See our{" "}
                                    <Link href="/cookies" className="text-primary hover:underline">
                                        Cookie Policy
                                    </Link>{" "}
                                    for more information.
                                </>
                            )}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "7. Contacto" : "7. Contact"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? "Si tienes preguntas sobre esta política de privacidad, contáctanos en:" : "If you have questions about this privacy policy, contact us at:"}{" "}
                            <a href="mailto:privacy@serviscore.com" className="text-primary hover:underline ml-1">
                                privacy@serviscore.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
