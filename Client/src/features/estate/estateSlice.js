import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import estateService from './estateServices'
import { toast } from 'react-toastify'

export const createEstate = createAsyncThunk(
  'estate/create-estate',
  async (data, thunkAPI) => {
    try {
      return await estateService.addEstate(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getEmail = createAsyncThunk(
  'estate/get-email',
  async (id, thunkAPI) => {
    try {
      return await estateService?.getEmailOfOwner(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const userStates = createAsyncThunk(
  'estate/get-user-estates',
  async thunkAPI => {
    try {
      return await estateService?.getUserEstates()
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteState = createAsyncThunk(
  'estate/delete-estates',
  async (id, thunkAPI) => {
    try {
      return await estateService?.removeState(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getestates = createAsyncThunk(
  'estate/get-estates',
  async (query, thunkAPI) => {
    try {
      return await estateService?.getEstates(query)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getAllEstates = createAsyncThunk(
  'estate/get-all-estates',
  async thunkAPI => {
    try {
      return await estateService?.getAllEstates()
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getAnEstate = createAsyncThunk(
  'estate/get-estate',
  async (id, thunkAPI) => {
    try {
      return await estateService?.getestate(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const udateAnEstate = createAsyncThunk(
  'estate/update/ustate',
  async (data, thunkAPI) => {
    try {
      return await estateService.putEstate(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const resetState = createAction('Reset_all')

const initialState = {
  estates: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: ''
}
export const estateSlice = createSlice({
  name: 'estate',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(createEstate.pending, state => {
        state.isLoading = true
      })
      .addCase(createEstate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.CreateEstate = action.payload
        if (state.isSuccess) {
          toast.success('Listing is added Successfully !')
        }
      })
      .addCase(createEstate.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
      })
      .addCase(userStates.pending, state => {
        state.isLoading = true
      })
      .addCase(userStates.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.UserStates = action.payload
      })
      .addCase(userStates.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
      })
      .addCase(deleteState.pending, state => {
        state.isLoading = true
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.deletedEstate = action.payload
        if (state.isSuccess) {
          toast.success('Listing is deleted Successfully !')
        }
      })
      .addCase(deleteState.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
      })
      .addCase(getestates.pending, state => {
        state.isLoading = true
      })
      .addCase(getestates.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.getAllEstates = action.payload
      })
      .addCase(getestates.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })
      .addCase(getAllEstates.pending, state => {
        state.isLoading = true
      })
      .addCase(getAllEstates.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.getAllEstates = action.payload
      })
      .addCase(getAllEstates.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })

      .addCase(getAnEstate.pending, state => {
        state.isLoading = true
      })
      .addCase(getAnEstate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.Estate = action.payload
      })
      .addCase(getAnEstate.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        if (state.isError === true) {
          toast.error('This Estate is not Exist')
        }
      })
      .addCase(getEmail.pending, state => {
        state.isLoading = true
      })
      .addCase(getEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.Email = action.payload
      })
      .addCase(getEmail.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })
      .addCase(udateAnEstate.pending, state => {
        state.isLoading = true
      })
      .addCase(udateAnEstate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.UdateAnEstate = action.payload
        if (state.isSuccess) {
          toast.success('Listing is updated Successfully !')
        }
      })
      .addCase(udateAnEstate.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
      })
      .addCase(resetState, () => initialState)
  }
})
export default estateSlice.reducer
