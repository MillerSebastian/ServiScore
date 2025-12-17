import api from '../axios';

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface UpdateProfileData {
    first_name?: string;
    last_name?: string;
    photoUrl?: string;
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

    // 2. Login (via backend API)
    async loginUser(email: string, password: string): Promise<string> {
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            const token = data.access_token || data.token || data.accessToken;
            
            if (typeof window !== 'undefined' && token) {
                localStorage.setItem('access_token', token);
                // Decode JWT to get user_id
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.sub) {
                        localStorage.setItem('user_id', String(payload.sub));
                    }
                } catch (e) {
                    console.warn('Could not decode JWT:', e);
                }
            }
            
            return token || '';
        } catch (error: any) {
            console.error("Login failed", error);
            throw new Error(error.response?.data?.message || 'Login failed');
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

    // 6. Send Verification Email (placeholder - implement with backend)
    async sendVerificationEmail(email: string, password: string) {
        console.log('[authService] sendVerificationEmail not implemented');
        throw new Error('Email verification not implemented');
    },

    // 7. Google Login (placeholder - implement with backend OAuth)
    async loginWithGoogle() {
        console.log('[authService] Google login not implemented');
        throw new Error('Google login not implemented');
    },

    // 8. Apple Login (placeholder - implement with backend OAuth)
    async loginWithApple() {
        console.log('[authService] Apple login not implemented');
        throw new Error('Apple login not implemented');
    },

    // 9. Upload Profile Picture (PATCH /users/:id with multipart/form-data)
    async uploadProfilePicture(idToken: string, file: File) {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                throw new Error('User ID not found');
            }
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.patch(`/users/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
        }
    },

    // 10. Upload Banner Image (POST /users/upload/banner)
    async uploadBanner(idToken: string, file: File) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/users/upload/banner', formData, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to upload banner');
        }
    },

    // 11. Logout
    async logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_data');
            localStorage.removeItem('user_img');
        }
    }
};
