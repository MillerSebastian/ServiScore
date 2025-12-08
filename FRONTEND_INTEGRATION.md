# ServiScore API - Guía de Integración Frontend

Guía completa para integrar todos los endpoints de la API ServiScore en tu aplicación frontend.

## Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Autenticación](#autenticación)
3. [Módulo de Administradores](#módulo-de-administradores)
4. [Módulo de Tiendas](#módulo-de-tiendas)
5. [Módulo de Servicios](#módulo-de-servicios)
6. [Sistema de Ratings](#sistema-de-ratings)
7. [Sistema de Comentarios](#sistema-de-comentarios)
8. [Sistema de Favoritos](#sistema-de-favoritos)
9. [Manejo de Errores](#manejo-de-errores)
10. [Ejemplos Completos](#ejemplos-completos)

---

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install firebase axios
# o
yarn add firebase axios
```

### 2. Configurar Firebase

Crea un archivo `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 3. Configurar Cliente HTTP

Crea un archivo `src/services/api.ts`:

```typescript
import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login si el token expiró
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Autenticación

### Tipos TypeScript

```typescript
// src/types/auth.types.ts
export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}
```

### Servicio de Autenticación

```typescript
// src/services/auth.service.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from './api';

class AuthService {
  // Registro manual
  async register(data: RegisterData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Actualizar perfil
      await userCredential.user.updateProfile({
        displayName: data.fullName
      });

      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Login manual
  async login(data: LoginData) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Login con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Sincronizar con backend
      await api.post('/auth/social-login');
      
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Logout
  async logout() {
    await signOut(auth);
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Obtener token
  async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}

export default new AuthService();
```

### Hook de Autenticación (React)

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import authService from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    login: authService.login,
    register: authService.register,
    loginWithGoogle: authService.loginWithGoogle,
    logout: authService.logout,
  };
};
```

---

## Módulo de Administradores

### Tipos

```typescript
// src/types/admin.types.ts
export interface Admin {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  banner?: string;
  rating?: number;
  role: 'admin';
  stores?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterAdminData {
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateAdminData {
  fullName?: string;
}
```

### Servicio

```typescript
// src/services/admin.service.ts
import api from './api';
import { Admin, RegisterAdminData, UpdateAdminData } from '../types/admin.types';

class AdminService {
  // Registrar admin
  async register(data: RegisterAdminData): Promise<{ message: string; admin: Admin }> {
    const response = await api.post('/admins/register', data);
    return response.data;
  }

  // Obtener perfil actual
  async getProfile(): Promise<Admin> {
    const response = await api.get('/admins/me');
    return response.data;
  }

  // Actualizar perfil
  async updateProfile(data: UpdateAdminData): Promise<Admin> {
    const response = await api.patch('/admins/me', data);
    return response.data;
  }

  // Subir foto de perfil
  async uploadProfilePicture(file: File): Promise<Admin> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admins/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Subir banner
  async uploadBanner(file: File): Promise<Admin> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admins/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}

export default new AdminService();
```

### Ejemplo de Uso

```typescript
// Componente de perfil de admin
import { useState, useEffect } from 'react';
import adminService from '../services/admin.service';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await adminService.getProfile();
      setAdmin(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updatedAdmin = await adminService.uploadProfilePicture(file);
      setAdmin(updatedAdmin);
      alert('Foto actualizada correctamente');
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{admin.fullName}</h1>
      <img src={admin.profilePicture} alt="Profile" />
      
      <input type="file" onChange={handleUploadPhoto} accept="image/*" />
    </div>
  );
};
```

---

## Módulo de Tiendas

### Tipos

```typescript
// src/types/store.types.ts
export interface StoreSchedule {
  open: string; // "HH:MM"
  close: string; // "HH:MM"
  isOpen: boolean;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  category: string;
  latitude?: number;
  longitude?: number;
  profilePicture?: string;
  logo?: string;
  banner?: string;
  photos?: string[];
  ownerId: string;
  services?: string[];
  rating?: number;
  totalLikes?: number;
  totalDislikes?: number;
  totalComments?: number;
  totalFavorites?: number;
  schedule?: {
    weekdays: StoreSchedule;
    saturday: StoreSchedule;
    sunday: StoreSchedule;
    holidays: StoreSchedule;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateStoreData {
  name: string;
  description: string;
  address: string;
  phone: string;
  category: string;
  latitude?: number;
  longitude?: number;
  schedule?: Store['schedule'];
}

export interface UpdateStoreData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  schedule?: Store['schedule'];
}
```

### Servicio

```typescript
// src/services/store.service.ts
import api from './api';
import { Store, CreateStoreData, UpdateStoreData } from '../types/store.types';

class StoreService {
  // Crear tienda
  async create(data: CreateStoreData): Promise<Store> {
    const response = await api.post('/stores', data);
    return response.data;
  }

  // Obtener tiendas del admin actual
  async getMyStores(): Promise<Store[]> {
    const response = await api.get('/stores');
    return response.data;
  }

  // Obtener tienda por ID
  async getById(id: string): Promise<Store> {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  }

  // Actualizar tienda
  async update(id: string, data: UpdateStoreData): Promise<Store> {
    const response = await api.patch(`/stores/${id}`, data);
    return response.data;
  }

  // Eliminar tienda
  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  }

  // Subir logo
  async uploadLogo(storeId: string, file: File): Promise<Store> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/stores/${storeId}/upload/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Subir banner
  async uploadBanner(storeId: string, file: File): Promise<Store> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/stores/${storeId}/upload/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Subir foto de perfil
  async uploadProfilePicture(storeId: string, file: File): Promise<Store> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/stores/${storeId}/upload/profile-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Agregar foto a galería
  async addPhoto(storeId: string, file: File): Promise<Store> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/stores/${storeId}/upload/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Eliminar foto de galería
  async deletePhoto(storeId: string, photoUrl: string): Promise<{ message: string }> {
    const response = await api.delete(`/stores/${storeId}/photos`, {
      data: { photoUrl }
    });
    return response.data;
  }
}

export default new StoreService();
```

### Ejemplo de Uso

```typescript
// Formulario de creación de tienda
import { useState } from 'react';
import storeService from '../services/store.service';

const CreateStoreForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    category: '',
    schedule: {
      weekdays: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '14:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
      holidays: { open: '00:00', close: '00:00', isOpen: false },
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const store = await storeService.create(formData);
      alert(`Tienda creada con ID: ${store.id}`);
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Error al crear la tienda');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <textarea
        placeholder="Descripción"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      
      <input
        type="text"
        placeholder="Dirección"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        required
      />
      
      <input
        type="tel"
        placeholder="Teléfono"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Seleccionar categoría</option>
        <option value="Restaurante">Restaurante</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Retail">Retail</option>
      </select>
      
      <button type="submit">Crear Tienda</button>
    </form>
  );
};
```

---

## Módulo de Servicios

### Tipos

```typescript
// src/types/service.types.ts
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  storeId?: string;
  storeName?: string;
  ownerId: string;
  price?: number;
  duration?: number; // en minutos
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateServiceData {
  name: string;
  description: string;
  category: string;
  storeId?: string;
  price?: number;
  duration?: number;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  category?: string;
  storeId?: string;
  price?: number;
  duration?: number;
}
```

### Servicio

```typescript
// src/services/service.service.ts
import api from './api';
import { Service, CreateServiceData, UpdateServiceData } from '../types/service.types';

class ServiceService {
  // Crear servicio
  async create(data: CreateServiceData): Promise<Service> {
    const response = await api.post('/services', data);
    return response.data;
  }

  // Obtener servicios del admin actual
  async getMyServices(): Promise<Service[]> {
    const response = await api.get('/services');
    return response.data;
  }

  // Obtener servicios por tienda
  async getByStore(storeId: string): Promise<Service[]> {
    const response = await api.get(`/services/by-store/${storeId}`);
    return response.data;
  }

  // Obtener servicio por ID
  async getById(id: string): Promise<Service> {
    const response = await api.get(`/services/${id}`);
    return response.data;
  }

  // Actualizar servicio
  async update(id: string, data: UpdateServiceData): Promise<Service> {
    const response = await api.patch(`/services/${id}`, data);
    return response.data;
  }

  // Eliminar servicio
  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
}

export default new ServiceService();
```

---

## Sistema de Ratings

### Tipos

```typescript
// src/types/rating.types.ts
export interface StoreRating {
  id: string;
  storeId: string;
  userId: string;
  isLike: boolean; // true = like, false = dislike
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Servicio

```typescript
// src/services/rating.service.ts
import api from './api';
import { StoreRating } from '../types/rating.types';

class RatingService {
  // Dar like a una tienda
  async likeStore(storeId: string): Promise<StoreRating> {
    const response = await api.post(`/store-ratings/${storeId}/like`);
    return response.data;
  }

  // Dar dislike a una tienda
  async dislikeStore(storeId: string): Promise<StoreRating> {
    const response = await api.post(`/store-ratings/${storeId}/dislike`);
    return response.data;
  }

  // Remover rating
  async removeRating(storeId: string): Promise<{ message: string }> {
    const response = await api.delete(`/store-ratings/${storeId}`);
    return response.data;
  }

  // Obtener mi rating para una tienda
  async getMyRating(storeId: string): Promise<StoreRating | null> {
    const response = await api.get(`/store-ratings/${storeId}/my-rating`);
    return response.data;
  }
}

export default new RatingService();
```

### Ejemplo de Uso

```typescript
// Componente de rating
import { useState, useEffect } from 'react';
import ratingService from '../services/rating.service';

const StoreRating = ({ storeId, currentRating, totalLikes, totalDislikes }) => {
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMyRating();
  }, [storeId]);

  const loadMyRating = async () => {
    try {
      const rating = await ratingService.getMyRating(storeId);
      setMyRating(rating);
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const rating = await ratingService.likeStore(storeId);
      setMyRating(rating);
    } catch (error) {
      console.error('Error liking store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    setLoading(true);
    try {
      const rating = await ratingService.dislikeStore(storeId);
      setMyRating(rating);
    } catch (error) {
      console.error('Error disliking store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await ratingService.removeRating(storeId);
      setMyRating(null);
    } catch (error) {
      console.error('Error removing rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-rating">
      <div className="rating-display">
        <span className="stars">{'⭐'.repeat(Math.round(currentRating))}</span>
        <span className="rating-value">{currentRating.toFixed(1)}</span>
      </div>
      
      <div className="rating-stats">
        <span>👍 {totalLikes} likes</span>
        <span>👎 {totalDislikes} dislikes</span>
      </div>
      
      <div className="rating-actions">
        <button 
          onClick={handleLike}
          disabled={loading}
          className={myRating?.isLike ? 'active' : ''}
        >
          👍 Like
        </button>
        
        <button 
          onClick={handleDislike}
          disabled={loading}
          className={myRating && !myRating.isLike ? 'active' : ''}
        >
          👎 Dislike
        </button>
        
        {myRating && (
          <button onClick={handleRemove} disabled={loading}>
            ❌ Remover
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## Sistema de Comentarios

### Tipos

```typescript
// src/types/comment.types.ts
export interface StoreComment {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  totalReplies?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentReply {
  id: string;
  commentId: string;
  storeId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCommentData {
  content: string;
}

export interface CreateReplyData {
  content: string;
}
```

### Servicio

```typescript
// src/services/comment.service.ts
import api from './api';
import { StoreComment, CommentReply, CreateCommentData, CreateReplyData } from '../types/comment.types';

class CommentService {
  // Crear comentario
  async createComment(storeId: string, data: CreateCommentData): Promise<StoreComment> {
    const response = await api.post(`/store-comments/${storeId}`, data);
    return response.data;
  }

  // Obtener comentarios (con paginación)
  async getComments(storeId: string, limit = 20, offset = 0): Promise<StoreComment[]> {
    const response = await api.get(`/store-comments/${storeId}`, {
      params: { limit, offset }
    });
    return response.data;
  }

  // Eliminar comentario
  async deleteComment(commentId: string): Promise<{ message: string }> {
    const response = await api.delete(`/store-comments/${commentId}`);
    return response.data;
  }

  // Crear respuesta
  async createReply(commentId: string, data: CreateReplyData): Promise<CommentReply> {
    const response = await api.post(`/store-comments/${commentId}/replies`, data);
    return response.data;
  }

  // Obtener respuestas
  async getReplies(commentId: string): Promise<CommentReply[]> {
    const response = await api.get(`/store-comments/${commentId}/replies`);
    return response.data;
  }

  // Eliminar respuesta
  async deleteReply(replyId: string): Promise<{ message: string }> {
    const response = await api.delete(`/store-comments/replies/${replyId}`);
    return response.data;
  }
}

export default new CommentService();
```

### Ejemplo de Uso

```typescript
// Componente de comentarios
import { useState, useEffect } from 'react';
import commentService from '../services/comment.service';
import { useAuth } from '../hooks/useAuth';

const StoreComments = ({ storeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [storeId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(storeId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await commentService.createComment(storeId, { content: newComment });
      setNewComment('');
      await loadComments(); // Recargar comentarios
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
      await commentService.deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comentarios</h3>
      
      {/* Formulario para nuevo comentario */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          maxLength={1000}
          required
        />
        <button type="submit" disabled={loading}>
          Comentar
        </button>
      </form>

      {/* Lista de comentarios */}
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            currentUserId={user?.uid}
          />
        ))}
      </div>
    </div>
  );
};

// Componente individual de comentario
const CommentItem = ({ comment, onDelete, currentUserId }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');

  const loadReplies = async () => {
    try {
      const data = await commentService.getReplies(comment.id);
      setReplies(data);
      setShowReplies(true);
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await commentService.createReply(comment.id, { content: replyText });
      setReplyText('');
      await loadReplies();
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <img src={comment.userPhoto || '/default-avatar.png'} alt={comment.userName} />
        <span className="username">{comment.userName}</span>
        <span className="date">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      
      <p className="comment-content">{comment.content}</p>
      
      <div className="comment-actions">
        <button onClick={loadReplies}>
          {showReplies ? 'Ocultar' : `Ver ${comment.totalReplies || 0} respuestas`}
        </button>
        
        {currentUserId === comment.userId && (
          <button onClick={() => onDelete(comment.id)}>Eliminar</button>
        )}
      </div>

      {/* Respuestas */}
      {showReplies && (
        <div className="replies">
          {replies.map((reply) => (
            <div key={reply.id} className="reply">
              <strong>{reply.userName}</strong>: {reply.content}
            </div>
          ))}
          
          <form onSubmit={handleReply} className="reply-form">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Responder..."
              maxLength={1000}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
};
```

---

## Sistema de Favoritos

### Tipos

```typescript
// src/types/favorite.types.ts
export interface StoreFavorite {
  id: string;
  storeId: string;
  userId: string;
  createdAt?: Date;
}
```

### Servicio

```typescript
// src/services/favorite.service.ts
import api from './api';
import { StoreFavorite } from '../types/favorite.types';
import { Store } from '../types/store.types';

class FavoriteService {
  // Agregar a favoritos
  async addFavorite(storeId: string): Promise<StoreFavorite> {
    const response = await api.post(`/store-favorites/${storeId}`);
    return response.data;
  }

  // Remover de favoritos
  async removeFavorite(storeId: string): Promise<{ message: string }> {
    const response = await api.delete(`/store-favorites/${storeId}`);
    return response.data;
  }

  // Obtener mis favoritos
  async getMyFavorites(): Promise<Store[]> {
    const response = await api.get('/store-favorites/my-favorites');
    return response.data;
  }

  // Verificar si es favorito
  async isFavorite(storeId: string): Promise<{ isFavorite: boolean }> {
    const response = await api.get(`/store-favorites/${storeId}/is-favorite`);
    return response.data;
  }
}

export default new FavoriteService();
```

### Ejemplo de Uso

```typescript
// Botón de favorito
import { useState, useEffect } from 'react';
import favoriteService from '../services/favorite.service';

const FavoriteButton = ({ storeId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [storeId]);

  const checkFavorite = async () => {
    try {
      const { isFavorite: fav } = await favoriteService.isFavorite(storeId);
      setIsFavorite(fav);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(storeId);
      } else {
        await favoriteService.addFavorite(storeId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
    >
      {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
    </button>
  );
};

// Página de favoritos
const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stores = await favoriteService.getMyFavorites();
      setFavorites(stores);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando favoritos...</div>;

  return (
    <div className="favorites-page">
      <h1>Mis Favoritos</h1>
      {favorites.length === 0 ? (
        <p>No tienes tiendas favoritas aún</p>
      ) : (
        <div className="stores-grid">
          {favorites.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Manejo de Errores

### Wrapper de Manejo de Errores

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Error de servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Error: ${data.message || 'Datos inválidos'}`;
      case 401:
        return 'No autorizado. Por favor inicia sesión.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error del servidor. Intenta más tarde.';
      default:
        return data.message || 'Error desconocido';
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu internet.';
  } else {
    // Error de configuración
    return error.message || 'Error inesperado';
  }
};
```

### Hook de Errores

```typescript
// src/hooks/useErrorHandler.ts
import { useState } from 'react';
import { handleApiError } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    const message = handleApiError(err);
    setError(message);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};
```

---

## Ejemplos Completos

### Página de Detalle de Tienda

```typescript
// StoreDetail.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import storeService from '../services/store.service';
import ratingService from '../services/rating.service';
import commentService from '../services/comment.service';
import favoriteService from '../services/favorite.service';

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreData();
  }, [id]);

  const loadStoreData = async () => {
    try {
      const storeData = await storeService.getById(id);
      setStore(storeData);
    } catch (error) {
      console.error('Error loading store:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!store) return <div>Tienda no encontrada</div>;

  return (
    <div className="store-detail">
      {/* Banner */}
      {store.banner && (
        <img src={store.banner} alt={store.name} className="store-banner" />
      )}

      {/* Header */}
      <div className="store-header">
        {store.logo && (
          <img src={store.logo} alt={store.name} className="store-logo" />
        )}
        <div className="store-info">
          <h1>{store.name}</h1>
          <p className="category">{store.category}</p>
          <StoreRating
            storeId={store.id}
            currentRating={store.rating}
            totalLikes={store.totalLikes}
            totalDislikes={store.totalDislikes}
          />
          <FavoriteButton storeId={store.id} />
        </div>
      </div>

      {/* Descripción */}
      <section className="store-description">
        <h2>Descripción</h2>
        <p>{store.description}</p>
      </section>

      {/* Información de contacto */}
      <section className="store-contact">
        <h2>Información de Contacto</h2>
        <p>📍 {store.address}</p>
        <p>📞 {store.phone}</p>
      </section>

      {/* Horarios */}
      {store.schedule && (
        <section className="store-schedule">
          <h2>Horarios</h2>
          <ScheduleDisplay schedule={store.schedule} />
        </section>
      )}

      {/* Galería de fotos */}
      {store.photos && store.photos.length > 0 && (
        <section className="store-gallery">
          <h2>Galería</h2>
          <div className="photo-grid">
            {store.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Foto ${index + 1}`} />
            ))}
          </div>
        </section>
      )}

      {/* Mapa */}
      {store.latitude && store.longitude && (
        <section className="store-map">
          <h2>Ubicación</h2>
          <MapComponent lat={store.latitude} lng={store.longitude} />
        </section>
      )}

      {/* Comentarios */}
      <section className="store-comments">
        <StoreComments storeId={store.id} />
      </section>
    </div>
  );
};
```

### Integración con Leaflet para Mapas

```bash
npm install leaflet react-leaflet
```

```typescript
// MapComponent.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ lat, lng, name }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
};
```

---

## Notas Importantes

### 1. Gestión de Estado
Para aplicaciones grandes, considera usar un gestor de estado como Redux o Zustand:

```typescript
// store/slices/storeSlice.ts (con Redux Toolkit)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeService from '../../services/store.service';

export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async () => {
    return await storeService.getMyStores();
  }
);

const storeSlice = createSlice({
  name: 'stores',
  initialState: {
    stores: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default storeSlice.reducer;
```

### 2. Caché de Datos
Usa React Query para cachear datos y mejorar el rendimiento:

```bash
npm install @tanstack/react-query
```

```typescript
// hooks/useStore.ts
import { useQuery } from '@tanstack/react-query';
import storeService from '../services/store.service';

export const useStore = (storeId: string) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getById(storeId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Uso en componente
const StoreDetail = ({ storeId }) => {
  const { data: store, isLoading, error } = useStore(storeId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{store.name}</div>;
};
```

### 3. Variables de Entorno
Crea un archivo `.env` para las variables de configuración:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Axios](https://axios-http.com/docs/intro)
- [React Query](https://tanstack.com/query/latest)
- [Leaflet para React](https://react-leaflet.js.org/)

---

## Soporte

Si encuentras algún problema con la API, contacta al equipo de backend o revisa la documentación de Swagger en `http://localhost:3000/api/docs`.
