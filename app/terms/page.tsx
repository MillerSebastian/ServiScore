"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function TermsOfService() {
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
                    {isEs ? "Términos de Servicio" : "Terms of Service"}
                </h1>
                
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground text-lg">
                        {isEs ? "Última actualización:" : "Last updated:"} {lastUpdated}
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "1. Aceptación de Términos" : "1. Acceptance of Terms"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Al acceder y utilizar ServiScore, aceptas cumplir con estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, no debes usar nuestra plataforma."
                                : "By accessing and using ServiScore, you agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you must not use our platform."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "2. Descripción del Servicio" : "2. Service Description"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "ServiScore es una plataforma que conecta a proveedores de servicios locales con clientes en su comunidad. Facilitamos el descubrimiento, la comunicación y la transacción entre ambas partes."
                                : "ServiScore is a platform that connects local service providers with customers in their community. We facilitate discovery, communication, and transactions between both parties."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "3. Registro y Cuenta" : "3. Registration and Account"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Para utilizar ciertos servicios, debes crear una cuenta proporcionando información precisa y completa. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña."
                                : "To use certain services, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account and password."}
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>{isEs ? "Debes tener al menos 18 años para crear una cuenta" : "You must be at least 18 years old to create an account"}</li>
                            <li>{isEs ? "Proporcionarás información veraz y actualizada" : "You will provide truthful and up-to-date information"}</li>
                            <li>{isEs ? "No compartirás tu cuenta con terceros" : "You will not share your account with third parties"}</li>
                            <li>{isEs ? "Notificarás inmediatamente cualquier uso no autorizado" : "You will immediately report any unauthorized use"}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "4. Conducta del Usuario" : "4. User Conduct"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? "Al usar ServiScore, te comprometes a:" : "By using ServiScore, you agree to:"}
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>{isEs ? "No publicar contenido falso, engañoso o fraudulento" : "Not post false, misleading, or fraudulent content"}</li>
                            <li>{isEs ? "Respetar los derechos de propiedad intelectual de terceros" : "Respect third-party intellectual property rights"}</li>
                            <li>{isEs ? "No acosar, amenazar o discriminar a otros usuarios" : "Not harass, threaten, or discriminate against other users"}</li>
                            <li>{isEs ? "No utilizar la plataforma para actividades ilegales" : "Not use the platform for illegal activities"}</li>
                            <li>{isEs ? "Cumplir con todas las leyes locales aplicables" : "Comply with all applicable local laws"}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "5. Servicios y Pagos" : "5. Services and Payments"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Los proveedores de servicios son responsables de establecer sus propios precios y condiciones. ServiScore puede cobrar una comisión por facilitar las transacciones. Todos los pagos se procesan de forma segura a través de nuestros socios de pago verificados."
                                : "Service providers are responsible for setting their own prices and terms. ServiScore may charge a fee to facilitate transactions. All payments are processed securely through our verified payment partners."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "6. Reseñas y Calificaciones" : "6. Reviews and Ratings"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Las reseñas deben ser honestas y basadas en experiencias reales. Nos reservamos el derecho de eliminar reseñas que violen nuestras políticas o que sean fraudulentas."
                                : "Reviews must be honest and based on real experiences. We reserve the right to remove reviews that violate our policies or are fraudulent."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "7. Limitación de Responsabilidad" : "7. Limitation of Liability"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "ServiScore actúa como intermediario entre proveedores y clientes. No somos responsables de la calidad, seguridad o legalidad de los servicios ofrecidos, ni de la capacidad de los usuarios para cumplir con sus obligaciones."
                                : "ServiScore acts as an intermediary between providers and customers. We are not responsible for the quality, safety, or legality of services offered, nor for users' ability to meet their obligations."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "8. Modificaciones del Servicio" : "8. Service Modifications"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento, con o sin previo aviso."
                                : "We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, with or without prior notice."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "9. Terminación" : "9. Termination"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Podemos suspender o terminar tu acceso a ServiScore si violas estos términos o por cualquier otra razón justificada. Puedes cancelar tu cuenta en cualquier momento desde la configuración."
                                : "We may suspend or terminate your access to ServiScore if you violate these terms or for any other justified reason. You can cancel your account at any time from your settings."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "10. Contacto" : "10. Contact"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? "Si tienes preguntas sobre estos términos, contáctanos en:" : "If you have questions about these terms, contact us at:"}{" "}
                            <a href="mailto:legal@serviscore.com" className="text-primary hover:underline ml-1">
                                legal@serviscore.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
