import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import InputAuth from '../components/InputAuth'
import ButtonAuth from '../components/ButtonAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../features/user/userSlice'
import { app } from '../components/FireBaseConfig'
import * as yup from 'yup'
import GoogleAuth from '../components/GoogleAuth'
import Header from '../components/Header'

let schema = yup.object().shape({
  email: yup
    .string()
    .email('Email should be valid')
    .required('Email is Required'),
  password: yup.string().required('Password is Required')
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [dataGoogle, setDataGoogle] = useState({})

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

  const gAuth = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)

      await setDataGoogle({
        email: result?.user?.email
      })
    } catch (err) {
      console.log(err)
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: dataGoogle?.email || '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: async values => {
      dispatch(login(values))
      if (isSuccess) {
        navigate('/')
      }
    }
  })

  return (
    <>
      <Header />
      <section className='mx-auto p-3 max-w-lg'>
        <h1 className='text-3xl text-center font-semibold my-7'>Login</h1>
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

          <InputAuth
            placeholder='Enter Your Password'
            id='password'
            type='password'
            value={formik.values.password}
            onChange={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
          />
          <div className='error'>
            {formik.touched.password && formik.errors.password}
          </div>

          <Link
            className='text-red-700 flex justify-start w-full ml-3'
            to='/forgetPassword'
          >
            Forget Password
          </Link>

          <ButtonAuth
            type='submit'
            value={`${isLoading ? 'Loading' : 'Login'} `}
            className={`${
              isLoading
                ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                : ''
            }`}
            disabled={isLoading}
          />

          <GoogleAuth onclick={gAuth} />
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

export default Login
