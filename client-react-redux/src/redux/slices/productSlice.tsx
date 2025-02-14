// src/redux/slices/productSlice.tsx
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { IProduct } from '../../models/product'



// For pagination, etc.
interface ProductState {
  products: IProduct[]
  loading: boolean
  error: string | null
  pageNumber: number
  totalPages: number
}

// If you need a query shape:
interface FetchProductsQuery {
  productName: string
  categoryName: string
  selfCode: string
  supplierName: string
  pageNumber: number
  pageSize: number
}

// Example async thunk
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (query: FetchProductsQuery, thunkAPI) => {
    try {
      // Example: Replace with your real fetch call
      const response = await fetch(
        `/api/products?productName=${query.productName}&categoryName=${query.categoryName}&pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`
      )
      const data = await response.json()
      return {
        products: data.products,
        totalPages: data.totalPages,
        pageNumber: data.pageNumber
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const initialState: ProductState = {

  products: [],
  loading: false,
  error: null,
  pageNumber: 1,
  totalPages: 1
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // If you have local reducers, put them here.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pageNumber = action.payload.pageNumber
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default productSlice.reducer
