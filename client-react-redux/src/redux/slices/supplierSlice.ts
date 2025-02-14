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
