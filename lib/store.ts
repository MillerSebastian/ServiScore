import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { MOCK_USERS, MOCK_STORES, MOCK_SERVICES, type User, type Store, type Service, type Comment } from "./mock-data"

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

// --- Stores Slice ---
interface StoresState {
  items: Store[]
}

const initialStateStores: StoresState = {
  items: MOCK_STORES,
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
        store.comments.unshift(action.payload.comment)
      }
    },
  },
})

// --- Services Slice ---
interface ServicesState {
  items: Service[]
}

const initialStateServices: ServicesState = {
  items: MOCK_SERVICES,
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
