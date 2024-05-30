import React, { useEffect } from 'react'
import { logout } from '../features/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const listingState = useSelector(state => state)
  let { auth } = listingState?.listing

  useEffect(() => {
    if (auth) {
      dispatch(logout())
      localStorage.clear()
      navigate('/login')
    }
  }, [auth])

  return (
    <>
      <Outlet />
      {/* <Footer /> */}
      <ToastContainer
        position='top-right'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  )
}

export default Layout
