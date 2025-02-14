#!/usr/bin/env bash

# Exit immediately if any command fails
set -e

# 1. Create a new folder (adjust name as needed)
mkdir my-toolkit-conversion
cd my-toolkit-conversion

# 2. Initialize a Node project
npm init -y

# 3. Install Redux Toolkit and react-redux
npm install @reduxjs/toolkit react-redux

# 4. Create a new folder structure, mirroring your existing "redux" folder,
#    but geared towards Redux Toolkit usage.
mkdir -p src/redux/slices
mkdir -p src/redux/store
mkdir -p src/redux/hooks

###################################
# 5. Create placeholder slice files
###################################

##########################
# Alert Slice (Example)
##########################
cat << 'EOF' > src/redux/slices/alertSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AlertState {
  message: string
  type: string
}

const initialState: AlertState = {
  message: '',
  type: ''
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<{ message: string, type: string }>) => {
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

##########################
# Auth Slice (Example)
##########################
cat << 'EOF' > src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  user: any
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
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
# Category Slice (Example)
#############################
cat << 'EOF' > src/redux/slices/categorySlice.ts
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
# Company Slice (Example)
#############################
cat << 'EOF' > src/redux/slices/companySlice.ts
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
# Discount Slice (Example)
#############################
cat << 'EOF' > src/redux/slices/discountSlice.ts
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
# Product Slice (Example)
#############################
cat << 'EOF' > src/redux/slices/productSlice.ts
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
# Shelf Slice (Example)
#############################
cat << 'EOF' > src/redux/slices/shelfSlice.ts
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
# Supplier Slice (Example)
#############################
cat << 'EOF' > src/redux/slices/supplierSlice.ts
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

#######################################
# 6. Create the Redux Toolkit store
#######################################
cat << 'EOF' > src/redux/store/store.ts
import { configureStore } from '@reduxjs/toolkit'

// Import the slices we just created
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
  },
  // Redux Toolkit adds redux-thunk by default,
  // plus some helpful middleware checks in development
})

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
EOF

#######################################
# 7. Create typed hooks (optional)
#######################################
cat << 'EOF' > src/redux/hooks/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'

// Use these throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
EOF

#######################################
# 8. For reference: old Redux code 
#    (OPTIONAL: You could show it commented out somewhere)
#######################################
cat << 'EOF' > src/redux/store/OLD_classicReduxExample.ts
// This file is optional. Just to show old code references:
// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
// import AlertReducer from '../reducers/AlertReducer'
// ...
// const rootReducer = combineReducers({ ... })
// const store = createStore(rootReducer, applyMiddleware(thunk))
// export default store
EOF

echo "✅ SUCCESS! Created 'my-toolkit-conversion' with Redux Toolkit slices + store."
echo "Next steps:"
echo "  1) Replace placeholder initial states and reducers with real logic."
echo "  2) Use 'store.ts' and your typed hooks in your React/TypeScript app."
echo "  3) Remove any old Redux folders/files that are no longer needed."

