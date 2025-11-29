"use client"

import Hero from "./sections/hero"
import About from "./sections/about"
import LandingTopbar from "./sections/landing-topbar"
import SupportSection from "./sections/supportSection"
import Footer from "./sections/footer"

// New Sections
import FeaturesSection from "./features/FeaturesSection"
import BenefitsSection from "./features/BenefitsSection"
import TestimonialsSection from "./features/TestimonialsSection"
import CTASection from "./features/CTASection"

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black relative">
            <LandingTopbar />
            <Hero />

            {/* New Features Section */}
            <div className="bg-background/5 backdrop-blur-sm">
                <FeaturesSection />
            </div>

            {/* New Benefits Section */}
            <div className="bg-background/5 backdrop-blur-sm">
                <BenefitsSection />
            </div>

            <About />

            {/* New Testimonials Section */}
            <div className="bg-background/5 backdrop-blur-sm">
                <TestimonialsSection />
            </div>

            <SupportSection />

            {/* New CTA Section */}
            <div className="bg-background/5 backdrop-blur-sm">
                <CTASection />
            </div>

            <Footer></Footer>
        </main>
    )
}