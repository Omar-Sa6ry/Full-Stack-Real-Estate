import axios from 'axios'
import { base_url } from '../../constant/base_url'
import { config } from '../../utils/ConfigAxios'

const register = async user => {
  const response = await axios.post(`${base_url}user/register`, user)
  if (response.data) {
    await localStorage.setItem('customer', JSON.stringify(response.data))
    return response.data
  }
}

const login = async user => {
  const response = await axios.post(`${base_url}user/login`, user, config)
  if (response.data) {
    await localStorage.setItem('customer', JSON.stringify(response.data))
    return response.data
  }
}

const signOut = async () => {
  const response = await axios.get(`${base_url}user/logout`)
  if (response.data) {
    return response.data
  }
}

const forgetPasswordToken = async email => {
  const response = await axios.post(
    `${base_url}user/Forgot-Password-Token`,
    email
  )
  if (response.data) {
    return response.data
  }
}

const removeUser = async () => {
  const response = await axios.delete(`${base_url}user/delete-user`, config)
  if (response.data) {
    return response.data
  }
}

const editUser = async user => {
  const response = await axios.put(`${base_url}user/edit-user`, user, config)
  if (response.data) {
    return response.data
  }
}

const editPassword = async user => {
  const response = await axios.put(
    `${base_url}user/Change-Password`,
    user,
    config
  )
  if (response.data) {
    return response.data
  }
}

const authService = {
  register,
  login,
  signOut,
  forgetPasswordToken,
  removeUser,
  editUser,
  editPassword
}

export default authService
