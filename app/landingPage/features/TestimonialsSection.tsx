"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Customer Success Manager",
        content: "ServiScore has completely transformed how we track our team's performance. The insights are invaluable!",
        avatar: "/avatars/01.png",
    },
    {
        name: "Michael Chen",
        role: "Operations Director",
        content: "The automated feedback collection has saved us countless hours. Highly recommended!",
        avatar: "/avatars/02.png",
    },
    {
        name: "Emily Davis",
        role: "Team Lead",
        content: "My team loves the gamification aspects. It's made improving service quality fun and engaging.",
        avatar: "/avatars/03.png",
    },
    {
        name: "David Wilson",
        role: "CEO",
        content: "We've seen a 30% increase in customer satisfaction scores since implementing ServiScore.",
        avatar: "/avatars/04.png",
    },
    {
        name: "Jessica Taylor",
        role: "Support Specialist",
        content: "The interface is so intuitive. I was up and running in minutes without any training.",
        avatar: "/avatars/05.png",
    },
    {
        name: "Robert Brown",
        role: "VP of Services",
        content: "The analytics dashboard gives me exactly the high-level view I need to make strategic decisions.",
        avatar: "/avatars/06.png",
    },
    {
        name: "Lisa Anderson",
        role: "Customer Experience Head",
        content: "Finally, a tool that actually helps us understand what our customers are thinking in real-time.",
        avatar: "/avatars/07.png",
    },
    {
        name: "James Martin",
        role: "Service Manager",
        content: "The chatbot integration is a game-changer. It handles the routine stuff so we can focus on complex issues.",
        avatar: "/avatars/08.png",
    },
    {
        name: "Kelly White",
        role: "Business Owner",
        content: "ServiScore pays for itself. The customer retention we've gained is worth every penny.",
        avatar: "/avatars/09.png",
    },
    {
        name: "Daniel Thompson",
        role: "Tech Lead",
        content: "Implementation was a breeze. The API documentation is excellent and the support team is super helpful.",
        avatar: "/avatars/10.png",
    },
    {
        name: "Amanda Martinez",
        role: "Small Business Owner",
        content: "I was skeptical at first, but the results speak for themselves. Our reviews have never been better.",
        avatar: "/avatars/11.png",
    },
    {
        name: "Christopher Lee",
        role: "Product Manager",
        content: "The insights we get from ServiScore have directly influenced our product roadmap.",
        avatar: "/avatars/12.png",
    },
    {
        name: "Michelle Wright",
        role: "HR Director",
        content: "It's not just about customer scores; it's about employee recognition. Our team morale has improved.",
        avatar: "/avatars/13.png",
    },
    {
        name: "Kevin Garcia",
        role: "Sales Manager",
        content: "We use the feedback to train our sales team. It's an essential part of our coaching process now.",
        avatar: "/avatars/14.png",
    },
    {
        name: "Rachel Rodriguez",
        role: "Marketing Head",
        content: "We can finally measure the ROI of our customer service initiatives accurately.",
        avatar: "/avatars/15.png",
    },
    {
        name: "Thomas Anderson",
        role: "Operations Manager",
        content: "The real-time alerts allow us to address negative feedback before it becomes a public issue.",
        avatar: "/avatars/16.png",
    },
    {
        name: "Jennifer Lopez",
        role: "Customer Support",
        content: "The interface is clean and easy to use. I actually enjoy logging in to check our stats.",
        avatar: "/avatars/17.png",
    },
    {
        name: "Matthew Scott",
        role: "Regional Director",
        content: "Managing multiple locations was a nightmare. ServiScore brings everything into one dashboard.",
        avatar: "/avatars/18.png",
    },
    {
        name: "Laura Green",
        role: "Quality Assurance",
        content: "The automated reporting saves me hours of work every week. I can focus on analysis instead of data entry.",
        avatar: "/avatars/19.png",
    },
    {
        name: "Justin Baker",
        role: "Freelancer",
        content: "Even for a one-person show like me, this tool helps me look professional and keep clients happy.",
        avatar: "/avatars/20.png",
    },
]

// Split into two rows of 10 for the visual effect (duplicated for infinite scroll)
const firstHalf = testimonials.slice(0, 10)
const secondHalf = testimonials.slice(10, 20)

const row1 = [...firstHalf, ...firstHalf]
const row2 = [...secondHalf, ...secondHalf]

export default function TestimonialsSection() {
    const { t } = useLanguage()
    
    return (
        <section id="testimonials" className="py-20 overflow-hidden bg-muted/30">
            <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">{t("landing.testimonials.title")}</h2>
                <p className="text-muted-foreground md:text-xl/relaxed max-w-[800px] mx-auto">
                    {t("landing.testimonials.subtitle")}
                </p>
            </div>

            <div className="space-y-8">
                {/* Row 1 - Moving Right */}
                <div className="relative w-full overflow-hidden">
                    <div className="flex w-max animate-infinite-scroll-reverse hover:pause gap-6 px-6">
                        {row1.map((testimonial, index) => (
                            <Card key={`row1-${index}`} className="w-[350px] shrink-0 border-none shadow-soft hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar>
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${index}`} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                        <div className="ml-auto flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Row 2 - Moving Left */}
                <div className="relative w-full overflow-hidden">
                    <div className="flex w-max animate-infinite-scroll hover:pause gap-6 px-6">
                        {row2.map((testimonial, index) => (
                            <Card key={`row2-${index}`} className="w-[350px] shrink-0 border-none shadow-soft hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar>
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${index + 20}`} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                        <div className="ml-auto flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
