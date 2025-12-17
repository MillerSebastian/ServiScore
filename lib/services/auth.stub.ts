import { auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  UserCredential,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

export interface RegisterData {
  email: string
  password: string
  fullName: string
}

export interface UpdateProfileData {
  fullName?: string
  profilePicture?: string
}

const buildUser = (u: any) => ({
  id: u.uid,
  email: u.email || '',
  fullName: u.displayName || (u.email ? u.email.split('@')[0] : 'User'),
  profilePicture: u.photoURL || undefined,
  banner: undefined as string | undefined,
  rating: 0,
  completedServices: 0,
  publishedServices: [] as any[],
})

export const authService = {
  // 1. Registration (via local API proxy to avoid CORS)
  async registerUser(data: RegisterData) {
    const [firstName, ...lastParts] = (data.fullName || '').trim().split(' ')
    const payload = {
      accessData: {
        email: data.email,
        password: data.password,
        roleId: 1,
      },
      userData: {
        first_name: firstName || data.fullName,
        last_name: lastParts.join(' ').trim() || '',
        accessId: 1,
      },
    }
    // Use local API proxy to avoid CORS issues in production
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Registration failed with status ${res.status}`)
    }
    const json = await res.json().catch(() => ({}))
    // Keep local Firebase profile name in sync (best-effort, optional)
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      const user = userCredential.user
      if (data.fullName) {
        await fbUpdateProfile(user, { displayName: data.fullName })
      }
      return { uid: user.uid, email: user.email, fullName: data.fullName, backend: json }
    } catch {
      // If Firebase local account is not desired or fails, still return backend response
      return { uid: '', email: data.email, fullName: data.fullName, backend: json } as any
    }
  },

  // 2. Login (via local API proxy to avoid CORS)
  async loginUser(email: string, password: string): Promise<string> {
    console.log('[authService.loginUser] Calling local proxy: /api/auth/login')
    // Use local API proxy to avoid CORS issues in production
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    console.log('[authService.loginUser] Response status:', res.status)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('[authService.loginUser] Error data:', errorData)
      throw new Error(errorData.message || `Login failed with status ${res.status}`)
    }
    const data = await res.json()
    console.log('[authService.loginUser] Full response data:', JSON.stringify(data, null, 2))
    // Store token and user info in localStorage for persistence
    if (typeof window !== 'undefined') {
      const token = data.access_token || data.token || data.accessToken
      if (token) {
        localStorage.setItem('access_token', token)
        console.log('[authService.loginUser] Token saved')
        
        // Decode JWT to get user_id from 'sub' field
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('[authService.loginUser] JWT payload:', payload)
          if (payload.sub) {
            localStorage.setItem('user_id', String(payload.sub))
            console.log('[authService.loginUser] User ID from JWT sub:', payload.sub)
          }
        } catch (e) {
          console.warn('[authService.loginUser] Could not decode JWT:', e)
        }
      }
      
      // Also try to get id_user from response body (fallback)
      const userId = data.id_user || data.userId || data.user_id || data.id
      if (userId && !localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', String(userId))
        console.log('[authService.loginUser] User ID from response:', userId)
      }
      
      // Store user data from login response
      localStorage.setItem('user_data', JSON.stringify(data))
    }
    return data.access_token || data.token || data.accessToken || ''
  },

  // 3. Sync User / Social Login (stub)
  async syncUser(idToken: string) {
    return { ok: true }
  },

  // 4. Get User Profile (via local API proxy to avoid CORS)
  async getProfile(idToken: string) {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
    const token = idToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null)
    
    console.log('[authService.getProfile] userId:', userId, 'token:', token ? 'exists' : 'null')
    
    if (!userId || !token) {
      throw new Error('Not authenticated - missing user_id or token')
    }
    
    // Use local API proxy to avoid CORS issues in production
    console.log('[authService.getProfile] Fetching from proxy:', `/api/proxy/users/${userId}`)
    const res = await fetch(`/api/proxy/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      console.error('[authService.getProfile] Failed to fetch user:', res.status)
      throw new Error(`Failed to fetch profile: ${res.status}`)
    }
    
    const userData = await res.json()
    console.log('[authService.getProfile] User data from backend:', userData)
    
    // Fetch user image via proxy
    let profilePicture: string | undefined
    try {
      const imgRes = await fetch(`/api/proxy/user-images`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (imgRes.ok) {
        const imgData = await imgRes.json()
        console.log('[authService.getProfile] Images data:', imgData)
        if (Array.isArray(imgData)) {
          const userImg = imgData.find((img: any) => 
            img.user_id === Number(userId) || img.userId === Number(userId)
          )
          if (userImg) {
            profilePicture = userImg.image_url || userImg.url
          }
        }
      }
    } catch (e) {
      console.warn('[authService.getProfile] Could not fetch user image:', e)
    }
    
    if (profilePicture && typeof window !== 'undefined') {
      localStorage.setItem('user_img', profilePicture)
    }
    
    const firstName = userData.first_name || userData.firstName || ''
    const lastName = userData.last_name || userData.lastName || ''
    
    return {
      id: userData.id_user || userData.id || userId,
      email: userData.email || '',
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim() || 'User',
      profilePicture: profilePicture || localStorage.getItem('user_img') || undefined,
      banner: undefined as string | undefined,
      rating: userData.rating || 0,
      completedServices: userData.completedServices || userData.completed_services || 0,
      publishedServices: userData.publishedServices || userData.published_services || [],
    }
  },

  // 5. Update Profile (local via Firebase profile)
  async updateProfile(idToken: string, data: UpdateProfileData) {
    const u = auth.currentUser
    if (!u) throw new Error('Not authenticated')
    if (data.fullName || data.profilePicture) {
      await fbUpdateProfile(u, {
        displayName: data.fullName ?? u.displayName ?? undefined,
        photoURL: data.profilePicture ?? u.photoURL ?? undefined,
      })
    }
    // Return latest user snapshot
    return buildUser(auth.currentUser)
  },

  // 6. Send Verification Email
  async sendVerificationEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await sendEmailVerification(user)
    await signOut(auth)
  },

  // 7. Google Login
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user
    const idToken = await user.getIdToken()
    return idToken
  },

  // 8. Apple Login
  async loginWithApple() {
    const provider = new OAuthProvider('apple.com')
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user
    const idToken = await user.getIdToken()
    return idToken
  },

  // 9. Upload Profile Picture (client-only stub)
  async uploadProfilePicture(idToken: string, file: File) {
    const u = auth.currentUser
    if (!u) throw new Error('Not authenticated')
    const fileUrl = typeof URL !== 'undefined' ? URL.createObjectURL(file) : '/placeholder.svg'
    await fbUpdateProfile(u, { photoURL: fileUrl })
    return buildUser(auth.currentUser)
  },

  // 10. Upload Banner Image (client-only stub)
  async uploadBanner(idToken: string, file: File) {
    const u = auth.currentUser
    if (!u) throw new Error('Not authenticated')
    const fileUrl = typeof URL !== 'undefined' ? URL.createObjectURL(file) : '/placeholder.svg'
    const userObj = buildUser(u)
    userObj.banner = fileUrl
    return userObj
  },

  // 11. Logout
  async logout() {
    // Clear backend tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_data')
      localStorage.removeItem('user_img')
    }
    // Also sign out from Firebase
    await signOut(auth)
  },
}
