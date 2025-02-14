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
