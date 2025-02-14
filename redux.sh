
#!/usr/bin/env bash

# Exit immediately if a command fails
set -e

###############################################################################
# 1. Create a new folder and initialize a Node project
###############################################################################
mkdir my-redux-toolkit-app
cd my-redux-toolkit-app

npm init -y

###############################################################################
# 2. Install Redux Toolkit and React Redux
###############################################################################
npm install @reduxjs/toolkit react-redux

###############################################################################
# 3. Create folder structure
###############################################################################
mkdir -p src/redux/slices
mkdir -p src/redux/store
mkdir -p src/redux/hooks

###############################################################################
# 4. Create slices to replace your old reducers
###############################################################################

#############################
# alertSlice.tsx
#############################
cat << 'EOF' > src/redux/slices/alertSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AlertState {
  message: string
  type: 'success' | 'error' | 'info' | ''
}

const initialState: AlertState = {
  message: '',
  type: ''
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>
    ) => {
      state.message = action.payload.message
      state.type = action.payload.type
    },
    clearAlert: (state) => {
      state.message = ''
      state.type = ''
    }
  }
})

export const { setAlert, clearAlert } = alertSlice.actions
export default alertSlice.reducer
EOF

#############################
# authSlice.tsx
#############################
cat << 'EOF' > src/redux/slices/authSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  // Add more user fields as needed
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
EOF

#############################
# categorySlice.tsx
#############################
cat << 'EOF' > src/redux/slices/categorySlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Category {
  id: string
  name: string
}

interface CategoryState {
  categories: Category[]
}

const initialState: CategoryState = {
  categories: []
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload)
    }
  }
})

export const { setCategories, addCategory } = categorySlice.actions
export default categorySlice.reducer
EOF

#############################
# companySlice.tsx
#############################
cat << 'EOF' > src/redux/slices/companySlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Company {
  id: string
  name: string
}

interface CompanyState {
  companies: Company[]
}

const initialState: CompanyState = {
  companies: []
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload)
    }
  }
})

export const { setCompanies, addCompany } = companySlice.actions
export default companySlice.reducer
EOF

#############################
# discountSlice.tsx
#############################
cat << 'EOF' > src/redux/slices/discountSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Discount {
  id: string
  value: number
}

interface DiscountState {
  discounts: Discount[]
}

const initialState: DiscountState = {
  discounts: []
}

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setDiscounts: (state, action: PayloadAction<Discount[]>) => {
      state.discounts = action.payload
    },
    addDiscount: (state, action: PayloadAction<Discount>) => {
      state.discounts.push(action.payload)
    }
  }
})

export const { setDiscounts, addDiscount } = discountSlice.actions
export default discountSlice.reducer
EOF

#############################
# productSlice.tsx
#############################
cat << 'EOF' > src/redux/slices/productSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Product {
  id: string
  name: string
  price: number
}

interface ProductState {
  products: Product[]
}

const initialState: ProductState = {
  products: []
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    }
  }
})

export const { setProducts, addProduct } = productSlice.actions
export default productSlice.reducer
EOF

#############################
# shelfSlice.tsx
#############################
cat << 'EOF' > src/redux/slices/shelfSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Shelf {
  id: string
  location: string
}

interface ShelfState {
  shelves: Shelf[]
}

const initialState: ShelfState = {
  shelves: []
}

const shelfSlice = createSlice({
  name: 'shelf',
  initialState,
  reducers: {
    setShelves: (state, action: PayloadAction<Shelf[]>) => {
      state.shelves = action.payload
    },
    addShelf: (state, action: PayloadAction<Shelf>) => {
      state.shelves.push(action.payload)
    }
  }
})

export const { setShelves, addShelf } = shelfSlice.actions
export default shelfSlice.reducer
EOF

#############################
# supplierSlice.tsx
#############################
cat << 'EOF' > src/redux/slices/supplierSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Supplier {
  id: string
  name: string
}

interface SupplierState {
  suppliers: Supplier[]
}

const initialState: SupplierState = {
  suppliers: []
}

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      state.suppliers = action.payload
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload)
    }
  }
})

export const { setSuppliers, addSupplier } = supplierSlice.actions
export default supplierSlice.reducer
EOF

###############################################################################
# 5. Create the Redux Toolkit store: store.tsx
###############################################################################
cat << 'EOF' > src/redux/store/store.tsx
import { configureStore } from '@reduxjs/toolkit'

// Import all slices here
import alertReducer from '../slices/alertSlice'
import authReducer from '../slices/authSlice'
import categoryReducer from '../slices/categorySlice'
import companyReducer from '../slices/companySlice'
import discountReducer from '../slices/discountSlice'
import productReducer from '../slices/productSlice'
import shelfReducer from '../slices/shelfSlice'
import supplierReducer from '../slices/supplierSlice'

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    category: categoryReducer,
    company: companyReducer,
    discount: discountReducer,
    product: productReducer,
    shelf: shelfReducer,
    supplier: supplierReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
EOF

###############################################################################
# 6. Create typed hooks: hooks.tsx
###############################################################################
cat << 'EOF' > src/redux/hooks/hooks.tsx
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'

// Use these throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
EOF

###############################################################################
# 7. All done!
###############################################################################
echo "✅ SUCCESS! A new folder 'my-redux-toolkit-app' has been created with:"
echo "    - package.json"
echo "    - node_modules (with @reduxjs/toolkit and react-redux)"
echo "    - src/redux/slices/ (8 slices for your replaced reducers)"
echo "    - src/redux/store/store.tsx (Redux Toolkit store)"
echo "    - src/redux/hooks/hooks.tsx (typed hooks)"
echo
echo "Next steps:"
echo "  1) Edit each slice file in src/redux/slices/*.tsx to fit your real logic/fields."
echo "  2) In your React app, wrap <App> with <Provider store={store}> from 'react-redux'."
echo "  3) Use the typed hooks (useAppDispatch, useAppSelector) in your components."
echo "Enjoy your Redux Toolkit setup!"

