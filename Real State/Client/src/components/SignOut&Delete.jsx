import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { deleteUser, logout } from '../features/user/userSlice'
import CustomModal from './Modal'

const SignOut = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [openS, setopenS] = useState(false)
  const [openD, setopenD] = useState(false)

  const showModalS = () => {
    setopenS(true)
  }

  const showModalD = () => {
    setopenD(true)
  }

  const handelSignOut = () => {
    setopenS(false)
    dispatch(logout())
    toast.success('You are logged out Successfully !')
    localStorage.clear()
    navigate('/login')
  }

  const handelDelete = () => {
    setopenD(false)
    dispatch(deleteUser())
    localStorage.clear()
    navigate('/login')
  }

  const cancelS = () => {
    setopenS(false)
  }

  const cancelD = () => {
    setopenD(false)
  }

  return (
    <div className='flex items-center justify-between mt-5 gap-2'>
      <CustomModal
        buttonTitle={'Sign Out'}
        content={'Are you Sure ,You want to Sign out from your Account?'}
        ok={handelSignOut}
        open={openS}
        cancel={cancelS}
        showModal={showModalS}
      />

      <CustomModal
        buttonTitle={'Delete an Account'}
        content={'Are you Sure ,You want to delete your Account?'}
        ok={handelDelete}
        open={openD}
        cancel={cancelD}
        showModal={showModalD}
      />
    </div>
  )
}

export default SignOut
