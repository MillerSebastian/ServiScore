import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider
} from "firebase/auth";

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface UpdateProfileData {
    displayName?: string;
    photoURL?: string;
}

export const authService = {
    // 1. Registration
    async registerUser(data: RegisterData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

            // Update display name
            if (data.fullName) {
                await updateProfile(userCredential.user, {
                    displayName: data.fullName
                });
            }

            // Create user document in Firestore
            await this.createUserDocument(userCredential.user, { fullName: data.fullName });

            return userCredential.user;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    // 2. Login
    async loginUser(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Ensure user doc exists for older users or if creation failed
            await this.createUserDocument(userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    },

    // 3. Logout
    async logout() {
        try {
            await signOut(auth);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_id');
                // clear other storage
            }
        } catch (error: any) {
            console.error("Logout failed", error);
        }
    },

    // 4. Social Login - Google
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await this.createUserDocument(result.user);
            return result.user;
        } catch (error: any) {
            throw new Error(error.message || 'Google login failed');
        }
    },

    // 5. Social Login - Apple
    async loginWithApple() {
        try {
            const provider = new OAuthProvider('apple.com');
            const result = await signInWithPopup(auth, provider);
            await this.createUserDocument(result.user);
            return result.user;
        } catch (error: any) {
            throw new Error(error.message || 'Apple login failed');
        }
    },

    // 6. Get Current User (Helper)
    getCurrentUser(): User | null {
        return auth.currentUser;
    },

    // 7. Create/Merge User Document in Firestore
    async createUserDocument(user: User, additionalData: any = {}) {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL,
                fullName: user.displayName || additionalData.fullName || 'User',
                createdAt: new Date().toISOString(),
                // Defaults for new users
                rating: 5.0,
                completedServices: 0,
                publishedServices: [],
                banner: null,
                ...additionalData
            }, { merge: true }); // Merge to avoid overwriting existing data
        } catch (error) {
            console.error("Error creating user document", error);
        }
    },

    // 8. Fetch User Profile from Firestore
    async getUserProfile(uid: string) {
        if (!uid) return null;
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                return userSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user profile", error);
            return null;
        }
    },

    // 9. Update User Profile in Firestore
    async updateUserProfile(uid: string, data: any) {
        if (!uid) return;
        try {
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, data, { merge: true });
        } catch (error) {
            console.error("Error updating user profile", error);
            throw error;
        }
    },

    // 10. Submit Verification
    async submitVerification(uid: string, data: any) {
        if (!uid) return;
        try {
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, {
                ...data,
                isVerified: true,
                role: 'provider', // Grant provider role
                verificationSubmittedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error submitting verification", error);
            throw error;
        }
    },

    // 11. Placeholder sync
    async syncUser(userOrToken: any) {
        return null;
    }
};

