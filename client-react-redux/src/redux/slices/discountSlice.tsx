// discountSlice.ts (expanded example)
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Discount {
  id: string
  value: number
  // If you want 'startDate', 'endDate', etc. add them here:
  // startDate?: Date
  // endDate?: Date
}

interface DiscountState {
  discounts: Discount[]
  // Additional fields:
  isAddDiscountModalOpen: boolean
  loading: boolean
}

const initialState: DiscountState = {
  discounts: [],
  isAddDiscountModalOpen: false,
  loading: false
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
    },
    // Now we can show/hide the modal:
    openDiscountModal: (state) => {
      state.isAddDiscountModalOpen = true
    },
    closeDiscountModal: (state) => {
      state.isAddDiscountModalOpen = false
    },
    // Basic 'loading' toggles:
    startLoading: (state) => {
      state.loading = true
    },
    stopLoading: (state) => {
      state.loading = false
    }
  }
})

export const {
  setDiscounts,
  addDiscount,
  openDiscountModal,
  closeDiscountModal,
  startLoading,
  stopLoading
} = discountSlice.actions

export default discountSlice.reducer
