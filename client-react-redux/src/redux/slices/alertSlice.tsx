// src/redux/slices/alertSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AlertState {
  message: string
  type: 'success' | 'error' | 'info' | ''
  // If you want to track "isOpen" in the store:
  // isOpen: boolean
}

const initialState: AlertState = {
  message: '',
  type: ''
  // isOpen: false
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
      // state.isOpen = true
    },
    clearAlert: (state) => {
      state.message = ''
      state.type = ''
      // state.isOpen = false
    }
  }
})

export const { setAlert, clearAlert } = alertSlice.actions
export default alertSlice.reducer
