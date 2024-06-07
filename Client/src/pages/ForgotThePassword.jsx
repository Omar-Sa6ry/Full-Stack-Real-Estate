import React, { useEffect } from 'react'
import InputAuth from '../components/InputAuth'
import ButtonAuth from '../components/ButtonAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import {  forgotPassword } from '../features/user/userSlice'
import * as yup from 'yup'
import Header from '../components/Header'

let schema = yup.object().shape({
  email: yup
    .string()
    .email('Email should be valid')
    .required('Email is Required')
})

const ForgotThePassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authState = useSelector(state => state)
  const { isSuccess, isLoading } = authState?.auth

  let getTokenFromLocalStorage = JSON.parse(
    localStorage?.getItem('customer')
  )?.token

  useEffect(() => {
    if (getTokenFromLocalStorage) {
      navigate('/')
    }
  }, [getTokenFromLocalStorage])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: ''
    },
    validationSchema: schema,
    onSubmit: async values => {
      dispatch(forgotPassword(values))
      if (isSuccess) {
        navigate('/login')
      }
    }
  })

  return (
    <>
      <Header />
      <section className='mx-auto p-3 max-w-lg'>
        <h1 className='text-3xl text-center font-semibold my-7'>
          Forgot Password
        </h1>
        <form
          onSubmit={formik.handleSubmit}
          className='flex-center flex-col gap-3'
        >
          <InputAuth
            type='email'
            placeholder='Enter Your Email'
            id='email'
            value={formik.values.email}
            onChange={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
          />
          <div className='error'>
            {formik.touched.email && formik.errors.email}
          </div>

          <ButtonAuth
            type='submit'
            value={`${isLoading ? 'Loading' : 'Forgot Password'} `}
            className={`${
              isLoading
                ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                : ''
            }`}
            disabled={isLoading}
          />
        </form>
        <div className='flex items-center mt-5 gap-2'>
          <p>Create an account</p>
          <Link className='text-blue-700' to='/register'>
            Sign Up
          </Link>
        </div>
      </section>
    </>
  )
}

export default ForgotThePassword
