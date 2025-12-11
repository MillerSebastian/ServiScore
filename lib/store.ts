import { configureStore, createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { MOCK_USERS, MOCK_STORES, MOCK_SERVICES, type User, type Store, type Service, type Comment } from "./mock-data"
import { storeService } from "./services/store.service"
import { serviceService } from "./services/service.service"
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
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async () => {
    const stores = await storeService.getMyStores()
    return stores
  }
)

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    const services = await serviceService.getMyServices()
    return services
  }
)

// --- Stores Slice ---
interface StoresState {
  items: Store[]
  loading: boolean
  error: string | null
}

const initialStateStores: StoresState = {
  items: [],
  loading: false,
  error: null,
}

const storesSlice = createSlice({
  name: "stores",
  initialState: initialStateStores,
  reducers: {
    addStore: (state, action: PayloadAction<Store>) => {
      state.items.push(action.payload)
    },
    addComment: (state, action: PayloadAction<{ storeId: string; comment: Comment }>) => {
      const store = state.items.find((s) => s.id === action.payload.storeId)
      if (store) {
        // @ts-ignore - comment structure compatibility
        if (!store.comments) store.comments = []
        // @ts-ignore
        store.comments.unshift(action.payload.comment)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch stores'
      })
  },
})

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
    stores: storesSlice.reducer,
    services: servicesSlice.reducer,
  },
})

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      stores: storesSlice.reducer,
      services: servicesSlice.reducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const { login, logout } = authSlice.actions
export const { addStore, addComment } = storesSlice.actions
export const { addService, applyToService } = servicesSlice.actions
