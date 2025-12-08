# Admin Authentication - Guía Completa de Integración

Guía detallada para implementar el sistema de autenticación y gestión de administradores en tu aplicación frontend.

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Modelo de Datos](#modelo-de-datos)
3. [Endpoints de Admin](#endpoints-de-admin)
4. [Configuración de Firebase](#configuración-de-firebase)
5. [Servicio de Admin](#servicio-de-admin)
6. [Flujo de Registro](#flujo-de-registro)
7. [Flujo de Login](#flujo-de-login)
8. [Componentes Completos](#componentes-completos)
9. [Gestión de Sesión](#gestión-de-sesión)
10. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Introducción

El sistema de administradores en ServiScore funciona con **Firebase Authentication** para el login/registro y la **API backend** para gestionar el perfil del admin.

### Flujo General

```
1. Usuario completa formulario de registro
   ↓
2. Frontend llama a POST /api/admins/register
   ↓
3. Backend crea usuario en Firebase Auth
   ↓
4. Backend crea perfil de admin en Firestore
   ↓
5. Frontend recibe respuesta con datos del admin
   ↓
6. Usuario puede hacer login con Firebase Auth
   ↓
7. Frontend obtiene ID token de Firebase
   ↓
8. Frontend usa el token para llamar endpoints protegidos
```

---

## Modelo de Datos

### Admin Entity

```typescript
// src/types/admin.types.ts

export interface Admin {
  id: string;                    // UID de Firebase Auth
  email: string;                 // Email del admin
  fullName: string;              // Nombre completo
  profilePicture?: string;       // URL de Cloudinary
  banner?: string;               // URL de Cloudinary
  rating?: number;               // Rating promedio (calculado)
  role: 'admin';                 // Siempre será 'admin'
  stores?: string[];             // IDs de tiendas del admin
  totalServices?: number;        // Total de servicios (opcional)
  completedServices?: number;    // Servicios completados (opcional)
  createdAt?: Date;              // Fecha de creación
  updatedAt?: Date;              // Fecha de actualización
}
```

### DTOs

```typescript
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
```

---

## Endpoints de Admin

### Resumen

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admins/register` | Registrar nuevo admin | ❌ |
| GET | `/admins/me` | Obtener perfil actual | ✅ |
| PATCH | `/admins/me` | Actualizar perfil | ✅ |
| POST | `/admins/upload/profile` | Subir foto de perfil | ✅ |
| POST | `/admins/upload/banner` | Subir banner | ✅ |

---

## Endpoint 1: POST `/admins/register` - Registrar Admin

Crea una nueva cuenta de administrador. Este endpoint **NO requiere autenticación**.

### Request

```typescript
POST http://localhost:3000/api/admins/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin123!",
  "fullName": "Juan Pérez"
}
```

### Validaciones

```typescript
const validations = {
  email: {
    required: true,
    format: 'email válido',
    unique: true, // No debe existir en Firebase
  },
  password: {
    required: true,
    minLength: 6,
    notes: 'Firebase requiere mínimo 6 caracteres',
  },
  fullName: {
    required: true,
    minLength: 1,
    type: 'string no vacío',
  },
};
```

### Response Exitosa (201)

```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": "buZBbGNI5aQB28BVwmWuucbDiUs1",
    "email": "admin@example.com",
    "fullName": "Juan Pérez",
    "role": "admin",
    "stores": [],
    "createdAt": "2025-12-08T18:00:00.000Z",
    "updatedAt": "2025-12-08T18:00:00.000Z"
  }
}
```

### Errores Comunes

```typescript
// 400 Bad Request - Email ya existe
{
  "message": "Email already exists",
  "error": "Bad Request",
  "statusCode": 400
}

// 400 Bad Request - Validación fallida
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Proceso en Backend

1. Valida datos de entrada
2. Crea usuario en Firebase Auth con `createUser()`
3. Crea documento en Firestore collection `admins`
4. Retorna datos del admin creado

### Notas Importantes

- ⚠️ **NO** usa Firebase Client SDK para este registro
- ✅ El backend maneja todo el proceso de creación
- 🔐 La contraseña se almacena solo en Firebase Auth (encriptada)
- 📧 El email se guarda también en Firestore para queries

---

## Endpoint 2: GET `/admins/me` - Obtener Perfil

Obtiene el perfil del admin autenticado. **Requiere token de Firebase**.

### Request

```typescript
GET http://localhost:3000/api/admins/me
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

### Cómo Obtener el Token

```typescript
import { auth } from '../config/firebase';

// Después de login
const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken();
  // Usar este token en el header Authorization
}
```

### Response Exitosa (200)

```json
{
  "id": "buZBbGNI5aQB28BVwmWuucbDiUs1",
  "email": "admin@example.com",
  "fullName": "Juan Pérez",
  "profilePicture": "https://res.cloudinary.com/xxx/image.jpg",
  "banner": "https://res.cloudinary.com/xxx/banner.jpg",
  "role": "admin",
  "stores": ["THyN2SxwuiCm9ZAF0T0d"],
  "rating": 4.5,
  "createdAt": "2025-12-08T18:00:00.000Z",
  "updatedAt": "2025-12-08T18:30:00.000Z"
}
```

### Errores Comunes

```typescript
// 401 Unauthorized - Token inválido o expirado
{
  "message": "Unauthorized",
  "statusCode": 401
}

// 404 Not Found - Perfil no existe en Firestore
{
  "message": "Admin not found",
  "statusCode": 404
}
```

---

## Endpoint 3: PATCH `/admins/me` - Actualizar Perfil

Actualiza información del perfil del admin.

### Request

```typescript
PATCH http://localhost:3000/api/admins/me
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json

{
  "fullName": "Juan Carlos Pérez"
}
```

### Response Exitosa (200)

```json
{
  "id": "buZBbGNI5aQB28BVwmWuucbDiUs1",
  "email": "admin@example.com",
  "fullName": "Juan Carlos Pérez",
  "role": "admin",
  "stores": ["THyN2SxwuiCm9ZAF0T0d"],
  "updatedAt": "2025-12-08T19:00:00.000Z"
}
```

---

## Endpoint 4: POST `/admins/upload/profile` - Subir Foto de Perfil

Sube una imagen para la foto de perfil del admin.

### Request

```typescript
POST http://localhost:3000/api/admins/upload/profile
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: multipart/form-data

FormData:
  file: [imagen.jpg]
```

### Ejemplo con JavaScript

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await api.post('/admins/upload/profile', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Response Exitosa (200)

```json
{
  "id": "buZBbGNI5aQB28BVwmWuucbDiUs1",
  "email": "admin@example.com",
  "fullName": "Juan Pérez",
  "profilePicture": "https://res.cloudinary.com/xxx/profile.jpg",
  "role": "admin"
}
```

### Validaciones

- ✅ Archivo debe ser una imagen (jpg, png, gif, webp)
- ✅ Tamaño máximo: depende de configuración de Cloudinary
- ✅ Se sube a Cloudinary y se guarda la URL

---

## Endpoint 5: POST `/admins/upload/banner` - Subir Banner

Similar al endpoint de foto de perfil, pero para el banner.

### Request

```typescript
POST http://localhost:3000/api/admins/upload/banner
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: multipart/form-data

FormData:
  file: [banner.jpg]
```

---

## Configuración de Firebase

### 1. Instalar Dependencias

```bash
npm install firebase
```

### 2. Configurar Firebase Client

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Obtén estos valores de Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth
export const auth = getAuth(app);
```

### 3. Variables de Entorno

```env
# .env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## Servicio de Admin

### Servicio Completo

```typescript
// src/services/admin.service.ts
import api from './api';
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
  async getProfile(): Promise<Admin> {
    try {
      const response = await api.get<Admin>(`${this.basePath}/me`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Actualizar perfil del admin
   * Requiere autenticación
   */
  async updateProfile(data: UpdateAdminDto): Promise<Admin> {
    try {
      const response = await api.patch<Admin>(`${this.basePath}/me`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Subir foto de perfil
   * Requiere autenticación
   */
  async uploadProfilePicture(file: File): Promise<Admin> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<Admin>(
        `${this.basePath}/upload/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  /**
   * Subir banner
   * Requiere autenticación
   */
  async uploadBanner(file: File): Promise<Admin> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<Admin>(
        `${this.basePath}/upload/banner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error uploading banner:', error);
      throw error;
    }
  }
}

export default new AdminService();
```

---

## Flujo de Registro

### Paso 1: Formulario de Registro

```typescript
// components/RegisterForm.tsx
import { useState } from 'react';
import adminService from '../services/admin.service';
import type { RegisterAdminDto } from '../types/admin.types';

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterAdminDto>({
    email: '',
    password: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Registrar admin en el backend
      const response = await adminService.register(formData);
      
      console.log('Admin registrado:', response.admin);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      
      // 2. Redirigir al login
      window.location.href = '/login';
      
    } catch (err: any) {
      console.error('Error en registro:', err);
      
      // Manejar errores
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          setError(err.response.data.message.join(', '));
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError('Error al registrar. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Registro de Administrador</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="fullName">Nombre Completo</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Juan Pérez"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@ejemplo.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
        />
        <small>Mínimo 6 caracteres</small>
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Registrando...' : 'Registrar'}
      </button>

      <p className="login-link">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </form>
  );
};

export default RegisterForm;
```

---

## Flujo de Login

### Paso 1: Servicio de Autenticación

```typescript
// services/auth.service.ts
import { 
  signInWithEmailAndPassword,
  signOut,
  User 
} from 'firebase/auth';
import { auth } from '../config/firebase';

class AuthService {
  /**
   * Login con email y contraseña usando Firebase
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar errores específicos de Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Usuario no encontrado');
        case 'auth/wrong-password':
          throw new Error('Contraseña incorrecta');
        case 'auth/invalid-email':
          throw new Error('Email inválido');
        case 'auth/user-disabled':
          throw new Error('Usuario deshabilitado');
        default:
          throw new Error('Error al iniciar sesión');
      }
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Obtener token de Firebase
   */
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}

export default new AuthService();
```

### Paso 2: Formulario de Login

```typescript
// components/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import adminService from '../services/admin.service';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Login con Firebase
      const user = await authService.login(formData.email, formData.password);
      console.log('Usuario autenticado:', user.uid);

      // 2. Obtener perfil del admin desde el backend
      const admin = await adminService.getProfile();
      console.log('Perfil del admin:', admin);

      // 3. Guardar en localStorage (opcional)
      localStorage.setItem('admin', JSON.stringify(admin));

      // 4. Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Error en login:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Iniciar Sesión</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@ejemplo.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tu contraseña"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <p className="register-link">
        ¿No tienes cuenta? <a href="/register">Regístrate</a>
      </p>
    </form>
  );
};

export default LoginForm;
```

---

## Gestión de Sesión

### Hook useAuth

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import authService from '../services/auth.service';
import adminService from '../services/admin.service';
import type { Admin } from '../types/admin.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observer de Firebase Auth
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Cargar perfil del admin
          const adminProfile = await adminService.getProfile();
          setAdmin(adminProfile);
        } catch (error) {
          console.error('Error loading admin profile:', error);
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const firebaseUser = await authService.login(email, password);
    const adminProfile = await adminService.getProfile();
    setAdmin(adminProfile);
    return adminProfile;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
    setUser(null);
  };

  return {
    user,
    admin,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};
```

### Uso en Componentes

```typescript
// App.tsx
import { useAuth } from './hooks/useAuth';

function App() {
  const { admin, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <NavBar admin={admin} />
      <Router />
    </div>
  );
}
```

---

## Componente de Perfil

```typescript
// components/AdminProfile.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import adminService from '../services/admin.service';

const AdminProfile = () => {
  const { admin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(admin?.fullName || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await adminService.updateProfile({ fullName });
      alert('Perfil actualizado');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const updated = await adminService.uploadProfilePicture(file);
      alert('Foto actualizada');
      // Recargar página o actualizar estado
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir foto');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return <div>Cargando perfil...</div>;

  return (
    <div className="admin-profile">
      <div className="profile-header">
        {admin.banner && (
          <img src={admin.banner} alt="Banner" className="banner" />
        )}
        
        <div className="profile-photo">
          {admin.profilePicture ? (
            <img src={admin.profilePicture} alt={admin.fullName} />
          ) : (
            <div className="placeholder">
              {admin.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <label htmlFor="photo-upload" className="upload-btn">
            📷 Cambiar foto
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="profile-info">
        {editing ? (
          <div className="edit-mode">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nombre completo"
            />
            <button onClick={handleUpdateProfile} disabled={loading}>
              Guardar
            </button>
            <button onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <div className="view-mode">
            <h2>{admin.fullName}</h2>
            <p>{admin.email}</p>
            <button onClick={() => setEditing(true)}>
              ✏️ Editar
            </button>
          </div>
        )}

        <div className="profile-stats">
          <div className="stat">
            <span className="value">{admin.stores?.length || 0}</span>
            <span className="label">Tiendas</span>
          </div>
          {admin.rating && (
            <div className="stat">
              <span className="value">⭐ {admin.rating.toFixed(1)}</span>
              <span className="label">Rating</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
```

---

## Protected Route

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// Uso en Router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Ejemplos de Testing

### Credenciales de Prueba

Cuenta creada en el seed script:

```
Email: atomiclabs.dev@gmail.com
Password: Admin123!
```

### Test con cURL

```bash
# 1. Registrar admin
curl -X POST http://localhost:3000/api/admins/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test Admin"
  }'

# 2. Login con Firebase (desde frontend)
# Usar Firebase SDK para obtener el token

# 3. Obtener perfil
curl -X GET http://localhost:3000/api/admins/me \
  -H "Authorization: Bearer <FIREBASE_TOKEN>"
```

---

## Resumen del Flujo Completo

```typescript
// 1. REGISTRO
const registerAdmin = async () => {
  const response = await adminService.register({
    email: 'admin@example.com',
    password: 'Admin123!',
    fullName: 'Juan Pérez'
  });
  // Backend crea usuario en Firebase + Firestore
  console.log('Admin creado:', response.admin);
};

// 2. LOGIN
const loginAdmin = async () => {
  // Login con Firebase Client SDK
  const user = await authService.login('admin@example.com', 'Admin123!');
  
  // Obtener token
  const token = await user.getIdToken();
  
  // Obtener perfil desde backend
  const admin = await adminService.getProfile();
  
  console.log('Admin autenticado:', admin);
};

// 3. USAR ENDPOINTS PROTEGIDOS
const useProtectedEndpoint = async () => {
  // El token se agrega automáticamente por el interceptor
  const stores = await storeService.getMyStores();
  console.log('Tiendas del admin:', stores);
};
```

---

## Notas Importantes

1. **Registro vs Login**:
   - ✅ Registro: usar `/api/admins/register` (backend)
   - ✅ Login: usar Firebase Client SDK

2. **Tokens**:
   - Los tokens de Firebase expiran después de 1 hora
   - El SDK de Firebase los renueva automáticamente
   - Usar `getIdToken()` siempre obtiene un token válido

3. **Seguridad**:
   - Nunca almacenar contraseñas en frontend
   - Los tokens se envían en header `Authorization: Bearer <token>`
   - Firebase Auth maneja encriptación y seguridad

4. **Errores Comunes**:
   - 401: Token inválido o expirado
   - 403: Usuario no es admin
   - 404: Perfil no existe en Firestore

---

## Recursos

- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/start)
- API Docs: `http://localhost:3000/api/docs`
- Código de ejemplo en repositorio
