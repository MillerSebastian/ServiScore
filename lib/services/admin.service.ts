import {
    Admin,
    RegisterAdminDto,
    UpdateAdminDto,
    RegisterAdminResponse
} from '../types/admin.types';

// Use local API proxy to avoid CORS issues in production
const BASE_URL = '/api/proxy'

function getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
}

function getAuthHeaders(): HeadersInit {
    const token = getToken()
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
}

class AdminService {
    private readonly basePath = '/admins';

    /**
     * Registrar un nuevo admin
     * Este endpoint NO requiere autenticación
     */
    async register(data: RegisterAdminDto): Promise<RegisterAdminResponse> {
        const res = await fetch(`${BASE_URL}${this.basePath}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const error = await res.json().catch(() => ({}))
            throw new Error(error.message || `Registration failed: ${res.status}`)
        }
        return res.json()
    }

    /**
     * Obtener perfil del admin actual
     * Requiere autenticación
     */
    async getProfile(idToken?: string): Promise<Admin> {
        const token = idToken || getToken()
        const res = await fetch(`${BASE_URL}${this.basePath}/me`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        })
        if (!res.ok) {
            throw new Error(`Failed to fetch admin profile: ${res.status}`)
        }
        return res.json()
    }

    /**
     * Actualizar perfil del admin
     * Requiere autenticación
     */
    async updateProfile(idToken: string | undefined, data: UpdateAdminDto): Promise<Admin> {
        const token = idToken || getToken()
        const res = await fetch(`${BASE_URL}${this.basePath}/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            throw new Error(`Failed to update admin profile: ${res.status}`)
        }
        return res.json()
    }

    /**
     * Subir foto de perfil
     * Requiere autenticación
     */
    async uploadProfilePicture(idToken: string | undefined, file: File): Promise<Admin> {
        const token = idToken || getToken()
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${BASE_URL}${this.basePath}/upload/profile`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: formData,
        })
        if (!res.ok) {
            throw new Error(`Failed to upload profile picture: ${res.status}`)
        }
        return res.json()
    }

    /**
     * Subir banner
     * Requiere autenticación
     */
    async uploadBanner(idToken: string | undefined, file: File): Promise<Admin> {
        const token = idToken || getToken()
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${BASE_URL}${this.basePath}/upload/banner`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: formData,
        })
        if (!res.ok) {
            throw new Error(`Failed to upload banner: ${res.status}`)
        }
        return res.json()
    }
}

export const adminService = new AdminService();
