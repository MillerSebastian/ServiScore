"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "en" | "es"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const translations = {
  en: {
    "nav.home": "Home",
    "nav.stores": "Stores",
    "nav.services": "Services",
    "nav.profile": "Profile",
    "nav.login": "Login",
    "home.hero.title": "Discover & Connect",
    "home.hero.subtitle":
      "Your community hub for finding the best local businesses and connecting with skilled neighbors.",
    "home.stores.title": "Top Rated Stores",
    "home.stores.upload": "Upload Store",
    "home.stores.viewAll": "View all",
    "home.services.title": "Community Services",
    "home.reviews": "reviews",
    "service.back": "Back to Services",
    "service.posted": "Posted on",
    "service.description": "Description",
    "service.applicants": "Applicants",
    "service.noApplicants": "No applicants yet.",
    "service.memberSince": "Member since",
    "service.rating": "Rating",
    "service.jobs": "Jobs",
    "service.viewProfile": "View Profile",
    "service.interested": "Interested?",
    "service.applyHelp": "Apply now to help {name} with this task.",
    "service.applied": "Applied",
    "service.apply": "Apply for Service",
    "service.accept": "Accept",
    "service.decline": "Decline",
    "service.notFound": "Service not found",
    "store.rate": "Rate this place",
    "store.reviews": "Reviews & Comments",
    "store.postComment": "Post Comment",
    "store.shareExperience": "Share your experience...",
    "store.about": "About",
    "store.photos": "Photos",
    "store.locationHours": "Location & Hours",
    "store.directions": "Directions",
    "store.back": "Back to Stores",
    "store.notFound": "Store not found",
    "profile.settings": "Settings",
    "profile.logout": "Logout",
    "profile.completed": "Completed",
    "profile.publishedServices": "Published Services",
    "profile.noServices": "No services published yet.",
    "profile.recentActivity": "Recent Activity",
    "profile.manage": "Manage",
    "profile.active": "Active",
    "common.location": "Location",
    "common.hours": "Hours",
    "common.about": "About",
    "common.loading": "Loading...",
  },
  es: {
    "nav.home": "Inicio",
    "nav.stores": "Tiendas",
    "nav.services": "Servicios",
    "nav.profile": "Perfil",
    "nav.login": "Iniciar Sesión",
    "home.hero.title": "Descubre y Conecta",
    "home.hero.subtitle":
      "Tu centro comunitario para encontrar los mejores negocios locales y conectar con vecinos talentosos.",
    "home.stores.title": "Tiendas Mejor Valoradas",
    "home.stores.upload": "Subir Tienda",
    "home.stores.viewAll": "Ver todo",
    "home.services.title": "Servicios Comunitarios",
    "home.reviews": "reseñas",
    "service.back": "Volver a Servicios",
    "service.posted": "Publicado el",
    "service.description": "Descripción",
    "service.applicants": "Solicitantes",
    "service.noApplicants": "Aún no hay solicitantes.",
    "service.memberSince": "Miembro desde",
    "service.rating": "Calif.",
    "service.jobs": "Trabajos",
    "service.viewProfile": "Ver Perfil",
    "service.interested": "¿Interesado?",
    "service.applyHelp": "Aplica ahora para ayudar a {name} con esta tarea.",
    "service.applied": "Aplicado",
    "service.apply": "Aplicar al Servicio",
    "service.accept": "Aceptar",
    "service.decline": "Rechazar",
    "service.notFound": "Servicio no encontrado",
    "store.rate": "Calificar lugar",
    "store.reviews": "Reseñas y Comentarios",
    "store.postComment": "Publicar Comentario",
    "store.shareExperience": "Comparte tu experiencia...",
    "store.about": "Sobre nosotros",
    "store.photos": "Fotos",
    "store.locationHours": "Ubicación y Horario",
    "store.directions": "Cómo llegar",
    "store.back": "Volver a Tiendas",
    "store.notFound": "Tienda no encontrada",
    "profile.settings": "Ajustes",
    "profile.logout": "Cerrar Sesión",
    "profile.completed": "Completados",
    "profile.publishedServices": "Servicios Publicados",
    "profile.noServices": "Aún no hay servicios publicados.",
    "profile.recentActivity": "Actividad Reciente",
    "profile.manage": "Gestionar",
    "profile.active": "Activo",
    "common.location": "Ubicación",
    "common.hours": "Horario",
    "common.about": "Sobre nosotros",
    "common.loading": "Cargando...",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key as keyof (typeof translations)["en"]] || key
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value))
      })
    }
    return text
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
