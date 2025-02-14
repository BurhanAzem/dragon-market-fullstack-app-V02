import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ICategory } from '../../models/category'

// The shape of our category slice state
interface CategoryState {
  categories: ICategory[]
  loading: boolean
  error: string | null
}

// Initial slice state
const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null
}

// Async thunk to fetch categories from an API
// Replace '/api/categories' with your real endpoint
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      // Assuming your API returns an array of { id, name, description }
      const data: ICategory[] = await response.json()
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// Create the category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Synchronous action if you need to manually set categories
    setCategories(state, action: PayloadAction<ICategory[]>) {
      state.categories = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch categories'
      })
  }
})

// Export actions and reducer
export const { setCategories } = categorySlice.actions
export default categorySlice.reducer
