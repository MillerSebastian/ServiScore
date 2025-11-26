import Hero from "./sections/hero"
import About from "./sections/about"
import Footer from "./sections/footer"

import LandingTopbar from "./sections/landing-topbar"
import SupportSection from "./sections/supportSection"

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black relative">
            <LandingTopbar />
            <Hero />
            <About />
            <SupportSection />
            <Footer />
        </main>
    )
}