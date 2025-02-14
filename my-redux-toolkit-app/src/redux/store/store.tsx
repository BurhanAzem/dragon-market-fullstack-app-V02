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
