import api from '../axios';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface UpdateProfileData {
    fullName?: string;
    profilePicture?: string;
}

export const authService = {
    // 1. Registration (POST /auth/register)
    async registerUser(data: RegisterData) {
        try {
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    // 2. Login (Client-Side Firebase)
    async loginUser(email: string, password: string): Promise<string> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            return idToken;
        } catch (error: any) {
            console.error("Login failed", error);
            throw error;
        }
    },

    // 3. Sync User / Social Login (POST /auth/social-login)
    async syncUser(idToken: string) {
        try {
            const response = await api.post('/auth/social-login', {}, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Sync user failed');
        }
    },

    // 4. Get User Profile (GET /users/me)
    async getProfile(idToken: string) {
        try {
            const response = await api.get('/users/me', {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    // 5. Update Profile (PATCH /users/me)
    async updateProfile(idToken: string, data: UpdateProfileData) {
        try {
            const response = await api.patch('/users/me', data, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },
};
