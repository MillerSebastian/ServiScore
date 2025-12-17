// Admin types and interfaces
export interface Admin {
    id: string;                    // UID de Firebase Auth
    email: string;                 // Email del admin
    fullName: string;              // Nombre completo
    profilePicture?: string;       // URL de Cloudinary
    banner?: string;               // URL de Cloudinary
    rating?: number;               // Rating promedio (calculado)
    role: 'admin';                 // Siempre será 'admin'
    totalServices?: number;        // Total de servicios (opcional)
    completedServices?: number;    // Servicios completados (opcional)
    createdAt?: Date;              // Fecha de creación
    updatedAt?: Date;              // Fecha de actualización
}

// DTO para registro
export interface RegisterAdminDto {
    email: string;
    password: string;
    fullName: string;
}

// DTO para actualizar perfil
export interface UpdateAdminDto {
    fullName?: string;
}

// Respuesta de registro
export interface RegisterAdminResponse {
    message: string;
    admin: Admin;
}
