import React, { useEffect } from 'react'
import InputAuth from '../components/InputAuth'
import ButtonAuth from '../components/ButtonAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { changePassword } from '../features/user/userSlice'
import { Link } from 'react-router-dom'
import SignOut from '../components/SignOut&Delete'
import Header from '../components/Header'

let schema = yup.object().shape({
  oldPassword: yup.string().required('Password is Required'),
  newPassword: yup.string().required('Password is Required')
})

const ChangePassword = () => {
  const dispatch = useDispatch()

  const authState = useSelector(state => state)
  const { isSuccess, isLoading } = authState?.auth

  useEffect(() => {
    if (isSuccess === true) {
      formik.resetForm()
    }
  }, [authState, isSuccess])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: '',
      newPassword: ''
    },
    validationSchema: schema,
    onSubmit: async values => {
      dispatch(changePassword(values))
    }
  })
  return (
    <>
      <Header />
      <section className='mx-auto p-3 max-w-lg'>
        <h1 className='text-3xl text-center font-semibold my-7'>
          Change Your Password
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          className='flex-center flex-col gap-3'
        >
          <InputAuth
            placeholder='Enter Your Password'
            id='oldPassword'
            type='password'
            value={formik.values.oldPassword}
            onChange={formik.handleChange('oldPassword')}
            onBlur={formik.handleBlur('oldPassword')}
          />
          <div className='error'>
            {formik.touched.oldPassword && formik.errors.oldPassword}
          </div>

          <InputAuth
            placeholder='Enter a New Password'
            id='newPassword'
            type='password'
            value={formik.values.newPassword}
            onChange={formik.handleChange('newPassword')}
            onBlur={formik.handleBlur('newPassword')}
          />
          <div className='error'>
            {formik.touched.newPassword && formik.errors.newPassword}
          </div>

          <ButtonAuth
            type='submit'
            value={`${isLoading ? 'Loading' : 'Update Your Password'} `}
            className={`${
              isLoading
                ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                : ''
            }`}
            disabled={isLoading}
          />
        </form>

        <Link to='/profile' className='mt-5 text-sky-600'>
          Change Your Email
        </Link>

        <SignOut />
      </section>
    </>
  )
}

export default ChangePassword
