import api from '../axios';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, UserCredential, sendEmailVerification, signOut, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

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

    // 6. Send Verification Email
    async sendVerificationEmail(email: string, password: string) {
        try {
            // 1. Sign in the user to get the User object
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Send verification email
            await sendEmailVerification(user);

            // 3. Sign out the user
            await signOut(auth);
        } catch (error: any) {
            console.error("Error sending verification email:", error);
            throw new Error(error.message || "Failed to send verification email");
        }
    },

    // 7. Google Login
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            return idToken;
        } catch (error: any) {
            console.error("Google login failed", error);
            throw error;
        }
    },

    // 8. Apple Login
    async loginWithApple() {
        try {
            const provider = new OAuthProvider('apple.com');
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            return idToken;
        } catch (error: any) {
            console.error("Apple login failed", error);
            throw error;
        }
    },

    // 9. Upload Profile Picture (POST /users/upload/profile)
    async uploadProfilePicture(idToken: string, file: File) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/users/upload/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'multipart/form-data', // Axios might handle this automatically, but explicit is safe for FormData
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
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error("Logout failed", error);
            throw error;
        }
    }
};
