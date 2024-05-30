import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/user/userSlice'
import listingReducer from '../features/estate/estateSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listing: listingReducer,
  }
})
