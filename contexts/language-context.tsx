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
    "auth.welcome": "Welcome back",
    "auth.login.subtitle": "Please enter your details to log in.",
    "auth.createAccount": "Create an account",
    "auth.register.subtitle": "Already have an account?",
    "auth.login": "Log in",
    "auth.signup": "Sign up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.firstName": "First name",
    "auth.lastName": "Last name",
    "auth.rememberMe": "Remember me",
    "auth.forgotPassword": "Forgot password?",
    "auth.orLogin": "Or log in with",
    "auth.orRegister": "Or register with",
    "auth.agree": "I agree to the",
    "auth.terms": "Terms & Conditions",
    "auth.google": "Google",
    "auth.apple": "Apple",
    "auth.overlay.title": "Capturing Moments, Creating Memories",
    "auth.overlay.subtitle": "Start your journey with us today.",
    "auth.backToWebsite": "Back to website",
    "auth.shop.title": "ServiScore Shop",
    "auth.shop.welcomeBack": "Welcome Back, Partner!",
    "auth.shop.manageStore": "Manage your store and track your success.",
    "auth.shop.joinNetwork": "Join Our Network",
    "auth.shop.registerStore": "Register your store and start improving your service scores.",
    "auth.shop.storeName": "Store Name",
    "auth.shop.category": "Category",
    "auth.shop.nit": "NIT",
    "auth.shop.address": "Address",
    "auth.shop.phone": "Phone",
    "auth.shop.logo": "Logo (Optional)",
  },
  es: {
    "nav.home": "Inicio",
    "nav.stores": "Tiendas",
    "nav.services": "Servicios",
    "nav.profile": "Perfil",
    "nav.login": "Iniciar Sesión",
    "nav.shopLogin": "Acceso Tienda",
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
    "auth.welcome": "Bienvenido de nuevo",
    "auth.login.subtitle": "Por favor ingrese sus detalles para iniciar sesión.",
    "auth.createAccount": "Crear una cuenta",
    "auth.register.subtitle": "¿Ya tienes una cuenta?",
    "auth.login": "Iniciar sesión",
    "auth.signup": "Registrarse",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.firstName": "Nombre",
    "auth.lastName": "Apellido",
    "auth.rememberMe": "Recuérdame",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.orLogin": "O iniciar sesión con",
    "auth.orRegister": "O registrarse con",
    "auth.agree": "Acepto los",
    "auth.terms": "Términos y Condiciones",
    "auth.google": "Google",
    "auth.apple": "Apple",
    "auth.overlay.title": "Capturando Momentos, Creando Recuerdos",
    "auth.overlay.subtitle": "Comienza tu viaje con nosotros hoy.",
    "auth.backToWebsite": "Volver al sitio web",
    "auth.shop.title": "ServiScore Tienda",
    "auth.shop.welcomeBack": "¡Bienvenido de nuevo, Socio!",
    "auth.shop.manageStore": "Gestiona tu tienda y sigue tu éxito.",
    "auth.shop.joinNetwork": "Únete a nuestra red",
    "auth.shop.registerStore": "Registra tu tienda y comienza a mejorar tus puntuaciones de servicio.",
    "auth.shop.storeName": "Nombre de la Tienda",
    "auth.shop.category": "Categoría",
    "auth.shop.nit": "NIT",
    "auth.shop.address": "Dirección",
    "auth.shop.phone": "Teléfono",
    "auth.shop.logo": "Logo (Opcional)",
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
