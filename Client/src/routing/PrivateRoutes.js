import { Navigate } from 'react-router-dom'

export const PrivateRoutes = ({ children }) => {
  const getTokenFromLocalStorage = JSON.parse(
    localStorage?.getItem('customer')
  )?.token

  return getTokenFromLocalStorage ? (
    children
  ) : (
    <Navigate to='/login' replace={true} />
  )
}
