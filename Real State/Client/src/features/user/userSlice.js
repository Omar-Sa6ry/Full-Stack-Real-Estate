import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import authService from './userServices'
import { toast } from 'react-toastify'

const getUserfromLocalStorage = localStorage.getItem('customer')
  ? JSON.parse(localStorage.getItem('customer'))
  : null

const initialState = {
  user: getUserfromLocalStorage,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: ''
}

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const logout = createAsyncThunk('auth/logout', async thunkAPI => {
  try {
    return await authService.signOut()
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async (email, thunkAPI) => {
    try {
      return await authService.forgetPasswordToken(email)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async (token, thunkAPI) => {
    try {
      return await authService.resetPasswordToken(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'auth/Delete-User',
  async thunkAPI => {
    try {
      return await authService.removeUser()
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/Change-Profile',
  async (user, thunkAPI) => {
    try {
      return await authService.editUser(user)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/Chnge-Password',
  async (user, thunkAPI) => {
    try {
      return await authService.editPassword(user)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const resetState = createAction('Reset_all')

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: buildeer => {
    buildeer
      .addCase(register.pending, state => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isError = false
        state.isLoading = false
        state.isSuccess = true
        localStorage.setItem('token', action.payload.token)
        if (state.isSuccess) {
          toast.success('User is created Successfullly!')
        }
        state.createdUser = action.payload
        state.message = 'success'
      })
      .addCase(register.rejected, (state, action) => {
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        state.isLoading = false
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })
      .addCase(login.pending, state => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isSuccess = true
        localStorage.setItem('token', action.payload.token)
        state.isError = false
        state.isLoading = false
        state.user = action.payload
        state.message = 'success'
        if (state.isSuccess === true) {
          toast.info('you are logged in successfully')
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })
      .addCase(logout.pending, state => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        state.isError = false
        state.Logout = action.payload
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isSuccess = true
        state.isLoading = false
        state.isError = false
        state.ForgotPassword = action.payload
        if (state.isSuccess) {
          toast.success('Email Sent Successfully !')
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        if (state.isError === true) {
          toast.error(action?.payload?.response?.data?.message)
        }
      })
      .addCase(deleteUser.pending, state => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.isSuccess = true
        state.ShowCart = action.payload
        if (state.isSuccess === true) {
          toast.success('Your Account is Deleted Successfully')
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.isSuccess = false
        state.message = action.error

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
      })
      .addCase(updateUser.pending, state => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isError = false
        state.isLoading = false
        state.isSuccess = true
        state.updatedUser = action.payload
        if (state.isSuccess === true) {
          let token = localStorage.getItem('token')

          let newUserData = {
            _id: state?.updatedUser?._id,
            token: token,
            firstname: action?.payload?.firstname,
            lastname: action?.payload?.lastname,
            email: action?.payload?.email,
            avatar: action?.payload?.avatar
          }

          localStorage.setItem('customer', JSON.stringify(newUserData))

          toast.success('User is Updated Successfullly!')
        }
        state.status = 200
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        state.isLoading = false
        state.status = 400

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
      })
      .addCase(changePassword.pending, state => {
        state.isLoading = true
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isError = false
        state.isLoading = false
        state.isSuccess = true
        state.changePassword = action.payload
        if (state.isSuccess === true) {
          toast.success('Password is Updated Successfullly!')
        }
        state.status = 200
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isError = true
        state.isSuccess = false
        state.message = action.error
        state.isLoading = false

        state.authError = 'Not Authorized token expired ,Please Login again'
        state.message = action?.payload?.response?.data?.message
        state.auth = state.authError === state.message

        if (state.isError === true) {
          toast.error(state?.message)
        }
        state.status = 400
      })
      .addCase(resetState, () => initialState)
  }
})

export default authSlice.reducer
