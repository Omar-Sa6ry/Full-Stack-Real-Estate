import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import InputAuth from '../components/InputAuth'
import ButtonAuth from '../components/ButtonAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { app } from '../components/FireBaseConfig'
import { register } from '../features/user/userSlice'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import GoogleAuth from '../components/GoogleAuth'
import Header from '../components/Header'

let schema = yup.object().shape({
  firstname: yup.string().required('First Name is Required'),
  lastname: yup.string().required('Last Name is Required'),
  email: yup
    .string()
    .email('Email should be valid')
    .required('Email is Required'),
  password: yup.string().required('Password is Required')
})

const Register = () => {
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
        firstname: result?._tokenResponse?.firstName,
        lastname: result?._tokenResponse?.lastName,
        email: result?.user?.email,
        avatar: result?.user?.photoURL
      })
    } catch (err) {
      console.log(err)
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: dataGoogle?.firstname || '',
      lastname: dataGoogle?.lastname || '',
      email: dataGoogle?.email || '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      values.avatar = dataGoogle?.avatar
      dispatch(register(values))
      if (isSuccess) {
        navigate('/')
      }
    }
  })

  return (
    <>
      <Header />
      <section className='mx-auto p-3 max-w-lg'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form
          onSubmit={formik.handleSubmit}
          className='flex-center flex-col gap-3'
        >
          <InputAuth
            placeholder='Enter First Name'
            id='firstname'
            type='text'
            value={formik.values.firstname}
            onChange={formik.handleChange('firstname')}
            onBlur={formik.handleBlur('firstname')}
          />
          <div className='error'>
            {formik.touched.firstname && formik.errors.firstname}
          </div>

          <InputAuth
            placeholder='Enter Last Name'
            id='lastname'
            type='text'
            value={formik.values.lastname}
            onChange={formik.handleChange('lastname')}
            onBlur={formik.handleBlur('lastname')}
          />
          <div className='error'>
            {formik.touched.lastname && formik.errors.lastname}
          </div>

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

          <ButtonAuth
            type='submit'
            value={`${isLoading ? 'Loading' : 'Sign Up'} `}
            className={`${
              isLoading
                ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                : ''
            }`}
            disabled={isLoading}
          />
        </form>
        <div className='mt-5'>
          <GoogleAuth onclick={gAuth} />
          <div className='flex items-center mt-5 gap-2'>
            <p>I have an account</p>
            <Link className='text-blue-700' to='/login'>
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register
