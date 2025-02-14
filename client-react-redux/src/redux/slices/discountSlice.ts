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
