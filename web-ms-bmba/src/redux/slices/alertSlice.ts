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
