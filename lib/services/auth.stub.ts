export interface RegisterData {
  email: string
  password: string
  fullName: string
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  photoUrl?: string
}

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
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Registration failed with status ${res.status}`)
    }
    const json = await res.json().catch(() => ({}))
    return { uid: '', email: data.email, fullName: data.fullName, backend: json }
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

    // Use photoUrl directly from user data (no separate endpoint needed)
    const profilePicture = userData.photoUrl || userData.photo_url || undefined

    if (profilePicture && typeof window !== 'undefined') {
      localStorage.setItem('user_img', profilePicture)
    }

    const firstName = userData.first_name || userData.firstName || ''
    const lastName = userData.last_name || userData.lastName || ''
    const email = userData.access?.email || userData.email || ''

    return {
      id: userData.id || userData.id_user || userId,
      email,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim() || 'User',
      photoUrl: profilePicture || localStorage.getItem('user_img') || undefined,
      rating: userData.rating || 0,
      completedServices: userData.completedServices || userData.completed_services || 0,
      publishedServices: userData.publishedServices || userData.published_services || [],
      isActive: userData.isActive,
      access: userData.access,
      banner: userData.banner || undefined,
    }
  },

  // 5. Update Profile (PATCH /users/:id)
  async updateProfile(idToken: string, data: UpdateProfileData) {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
    const token = idToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null)

    if (!userId || !token) {
      throw new Error('Not authenticated')
    }

    const res = await fetch(`/api/proxy/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error(`Failed to update profile: ${res.status}`)
    }

    return await res.json()
  },

  // 6. Send Verification Email (placeholder - implement with backend)
  async sendVerificationEmail(email: string, password: string) {
    console.log('[authService] sendVerificationEmail not implemented without Firebase')
    throw new Error('Email verification not implemented')
  },

  // 7. Google Login (placeholder - implement with backend OAuth)
  async loginWithGoogle() {
    console.log('[authService] Google login not implemented without Firebase')
    throw new Error('Google login not implemented')
  },

  // 8. Apple Login (placeholder - implement with backend OAuth)
  async loginWithApple() {
    console.log('[authService] Apple login not implemented without Firebase')
    throw new Error('Apple login not implemented')
  },

  // 9. Upload Profile Picture (PATCH /users/:id with multipart/form-data)
  async uploadProfilePicture(idToken: string, file: File) {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
    const token = idToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null)

    if (!userId || !token) {
      throw new Error('Not authenticated')
    }

    // Step 1: Upload to Cloudinary via local API
    const formData = new FormData()
    formData.append('file', file)

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to upload image: ${uploadRes.status}`)
    }

    const { url } = await uploadRes.json()

    // Step 2: Update user profile with the URL
    // Backend expects { photoUrl: string } (or similar, based on request context it was photoUrl)
    // The user request showed: "photoUrl": "https://..." in the JSON body example
    const res = await fetch(`/api/proxy/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoUrl: url }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update profile: ${res.status}`)
    }

    return await res.json()
  },

  // 10. Upload Banner Image (PATCH /users/:id with multipart/form-data)
  async uploadBanner(idToken: string, file: File) {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
    const token = idToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null)

    if (!userId || !token) {
      throw new Error('Not authenticated')
    }

    // Step 1: Upload to Cloudinary via local API
    const formData = new FormData()
    formData.append('file', file) // Reusing same generic 'file' field for upload endpoint

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to upload banner image: ${uploadRes.status}`)
    }

    const { url } = await uploadRes.json()

    // Step 2: Update user profile with the URL
    // Backend expects specific field for banner? Assuming 'banner' based on read code earlier.
    // In page.tsx: user.banner usage suggests it's a URL.
    // auth.stub.ts line 173: user.banner
    // I will call with { banner: url }
    const res = await fetch(`/api/proxy/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ banner: url }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update banner: ${res.status}`)
    }

    return await res.json()
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
  },
}
