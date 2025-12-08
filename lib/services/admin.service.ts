import api from '../axios';
import { auth } from '../firebase';
import {
    Admin,
    RegisterAdminDto,
    UpdateAdminDto,
    RegisterAdminResponse
} from '../types/admin.types';

class AdminService {
    private readonly basePath = '/admins';

    /**
     * Registrar un nuevo admin
     * Este endpoint NO requiere autenticación
     */
    async register(data: RegisterAdminDto): Promise<RegisterAdminResponse> {
        try {
            const response = await api.post<RegisterAdminResponse>(
                `${this.basePath}/register`,
                data
            );
            return response.data;
        } catch (error: any) {
            console.error('Error registering admin:', error);
            throw error;
        }
    }

    /**
     * Obtener perfil del admin actual
     * Requiere autenticación
     */
    async getProfile(idToken: string): Promise<Admin> {
        try {
            const response = await api.get<Admin>(`${this.basePath}/me`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching admin profile:', error);
            throw error;
        }
    }

    /**
     * Actualizar perfil del admin
     * Requiere autenticación
     */
    async updateProfile(idToken: string, data: UpdateAdminDto): Promise<Admin> {
        try {
            const response = await api.patch<Admin>(`${this.basePath}/me`, data, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error updating admin profile:', error);
            throw error;
        }
    }

    /**
     * Subir foto de perfil
     * Requiere autenticación
     */
    async uploadProfilePicture(idToken: string, file: File): Promise<Admin> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<Admin>(
                `${this.basePath}/upload/profile`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error uploading admin profile picture:', error);
            throw error;
        }
    }

    /**
     * Subir banner
     * Requiere autenticación
     */
    async uploadBanner(idToken: string, file: File): Promise<Admin> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<Admin>(
                `${this.basePath}/upload/banner`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error uploading admin banner:', error);
            throw error;
        }
    }
}

export const adminService = new AdminService();
