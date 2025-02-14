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
