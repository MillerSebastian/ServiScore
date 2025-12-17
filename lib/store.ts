import { configureStore, createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { MOCK_USERS, MOCK_SERVICES, type User, type Service } from "./mock-data"
import { servicesService } from "./services/services.service"
import { auth } from "./firebase"

// --- Auth Slice ---
interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const initialStateAuth: AuthState = {
  user: MOCK_USERS[0], // Auto-login as first user for MVP
  isAuthenticated: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialStateAuth,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

// --- Async Actions ---
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    const services = await servicesService.getAll()
    return services
  }
)

// (Stores removed) The app now focuses on services and user/auth state.

// --- Services Slice ---
interface ServicesState {
  items: Service[]
  loading: boolean
  error: string | null
}

const initialStateServices: ServicesState = {
  items: [],
  loading: false,
  error: null,
}

const servicesSlice = createSlice({
  name: "services",
  initialState: initialStateServices,
  reducers: {
    addService: (state, action: PayloadAction<Service>) => {
      state.items.push(action.payload)
    },
    applyToService: (state, action: PayloadAction<{ serviceId: string; userId: string }>) => {
      const service = state.items.find((s) => s.id === action.payload.serviceId)
      if (service && !service.applicants.includes(action.payload.userId)) {
        service.applicants.push(action.payload.userId)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch services'
      })
  },
})

// --- Store Configuration ---
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    services: servicesSlice.reducer,
  },
})

// Alias explícito para dejar claro que el store actual expone el slice `services`
export const servicesStore = store

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      services: servicesSlice.reducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const { login, logout } = authSlice.actions
export const { addService, applyToService } = servicesSlice.actions
