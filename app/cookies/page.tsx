"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function CookiePolicy() {
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
                    {isEs ? "Política de Cookies" : "Cookie Policy"}
                </h1>
                
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground text-lg">
                        {isEs ? "Última actualización:" : "Last updated:"} {lastUpdated}
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "¿Qué son las Cookies?" : "What Are Cookies?"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia al recordar tus preferencias y proporcionarte contenido relevante."
                                : "Cookies are small text files stored on your device when you visit our website. They help us improve your experience by remembering your preferences and providing relevant content."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "Tipos de Cookies que Utilizamos" : "Types of Cookies We Use"}
                        </h2>
                        
                        <div className="space-y-4 ml-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {isEs ? "1. Cookies Esenciales" : "1. Essential Cookies"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {isEs
                                        ? "Necesarias para el funcionamiento básico del sitio. Incluyen cookies de sesión y autenticación que te permiten iniciar sesión y navegar por la plataforma."
                                        : "Required for the basic operation of the site. These include session and authentication cookies that allow you to sign in and navigate the platform."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {isEs ? "2. Cookies de Rendimiento" : "2. Performance Cookies"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {isEs
                                        ? "Recopilan información sobre cómo usas nuestro sitio, como las páginas que visitas con más frecuencia. Nos ayudan a mejorar el rendimiento y la experiencia del usuario."
                                        : "They collect information about how you use our site, such as the pages you visit most often. They help us improve performance and user experience."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {isEs ? "3. Cookies de Funcionalidad" : "3. Functionality Cookies"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {isEs
                                        ? "Permiten recordar tus preferencias (como idioma, tema, ubicación) para proporcionarte una experiencia más personalizada."
                                        : "They allow us to remember your preferences (such as language, theme, and location) to provide a more personalized experience."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {isEs ? "4. Cookies de Publicidad" : "4. Advertising Cookies"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {isEs
                                        ? "Se utilizan para mostrarte anuncios relevantes basados en tus intereses. También limitan el número de veces que ves un anuncio."
                                        : "They are used to show you relevant ads based on your interests. They also limit the number of times you see an ad."}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "Cookies de Terceros" : "Third-Party Cookies"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Utilizamos servicios de terceros que también pueden colocar cookies en tu dispositivo:"
                                : "We use third-party services that may also place cookies on your device:"}
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li><strong>Google Analytics:</strong> {isEs ? "Para análisis de tráfico y comportamiento" : "For traffic and behavior analytics"}</li>
                            <li><strong>{isEs ? "Redes Sociales" : "Social Networks"}:</strong> {isEs ? "Para compartir contenido en plataformas sociales" : "To share content on social platforms"}</li>
                            <li><strong>{isEs ? "Procesadores de Pago" : "Payment Processors"}:</strong> {isEs ? "Para transacciones seguras" : "For secure transactions"}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "Gestión de Cookies" : "Cookie Management"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? "Puedes controlar y gestionar las cookies de varias formas:" : "You can control and manage cookies in several ways:"}
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>{isEs ? "A través de la configuración de tu navegador" : "Through your browser settings"}</li>
                            <li>{isEs ? "Usando nuestro panel de preferencias de cookies" : "Using our cookie preference panel"}</li>
                            <li>{isEs ? "Eliminando las cookies existentes en tu dispositivo" : "Deleting existing cookies on your device"}</li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                            {isEs
                                ? "Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio y limitar tu experiencia."
                                : "Please note that disabling certain cookies may affect site functionality and limit your experience."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "Configuración del Navegador" : "Browser Settings"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? "La mayoría de los navegadores te permiten:" : "Most browsers allow you to:"}
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>{isEs ? "Ver qué cookies tienes y eliminarlas individualmente" : "See what cookies you have and delete them individually"}</li>
                            <li>{isEs ? "Bloquear cookies de terceros" : "Block third-party cookies"}</li>
                            <li>{isEs ? "Bloquear cookies de sitios específicos" : "Block cookies from specific sites"}</li>
                            <li>{isEs ? "Bloquear todas las cookies" : "Block all cookies"}</li>
                            <li>{isEs ? "Eliminar todas las cookies al cerrar el navegador" : "Delete all cookies when you close your browser"}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "Actualizaciones de esta Política" : "Updates to This Policy"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs
                                ? "Podemos actualizar esta política de cookies ocasionalmente para reflejar cambios en nuestras prácticas o por razones operativas, legales o regulatorias."
                                : "We may update this cookie policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold mt-8">
                            {isEs ? "Más Información" : "More Information"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEs ? (
                                <>
                                    Para más detalles sobre cómo procesamos tus datos personales, consulta nuestra{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        Política de Privacidad
                                    </Link>.
                                </>
                            ) : (
                                <>
                                    For more details on how we process your personal data, see our{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </>
                            )}
                        </p>
                        <p className="text-muted-foreground">
                            {isEs ? "Si tienes preguntas sobre nuestra política de cookies, contáctanos en:" : "If you have questions about our cookie policy, contact us at:"}{" "}
                            <a href="mailto:cookies@serviscore.com" className="text-primary hover:underline ml-1">
                                cookies@serviscore.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
