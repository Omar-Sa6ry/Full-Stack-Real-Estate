import React, { useEffect, useRef, useState } from 'react'
import InputAuth from '../components/InputAuth'
import CustomModal from '../components/Modal'
import ButtonAuth from '../components/ButtonAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { deleteState, userStates } from '../features/estate/estateSlice'
import { logout, updateUser } from '../features/user/userSlice'
import { BiEdit } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import SignOut from '../components/SignOut&Delete'
import { app } from '../components/FireBaseConfig'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage'
import Header from '../components/Header'

let schema = yup.object().shape({
  firstname: yup.string().required('First Name is Required'),
  lastname: yup.string().required('Last Name is Required'),
  avatar: yup.string().required('Avatar  is Required'),
  email: yup
    .string()
    .email('Email should be valid')
    .required('Email is Required'),
  password: yup.string().required('Password is Required')
})

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [formData, setFormData] = useState({})
  const [fileUploadError, setFileUploadError] = useState(false)
  const [openE, setopenE] = useState(false)

  const authState = useSelector(state => state)
  const estateState = useSelector(state => state)
  const { user, isLoading, isSuccess } = authState?.auth
  const { UserStates, auth } = estateState?.listing

  console.log(UserStates)

  const showModalE = () => {
    setopenE(true)
  }

  const cancelE = () => {
    setopenE(false)
  }

  const handelDeleteEstate = _id => {
    dispatch(deleteState(_id))
    setopenE(false)
    dispatch(userStates())
    dispatch(userStates())
  }

  const handleFileUpload = file => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      error => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>
          setFormData(downloadURL)
        )
      }
    )
  }

  useEffect(() => {
    if (auth) {
      dispatch(logout())
      navigate('/login')
    }
  }, [auth])

  useEffect(() => {
    if (isSuccess === true) {
      formik.values.password = ''
    }
  }, [authState, isSuccess])

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      avatar: user?.avatar || '',
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: async values => {
      try {
        if (formData?.length > 0) {
          values.avatar = formData
        }
        dispatch(updateUser(values))
        navigate('/')
        navigate('/profile')
      } catch (err) {
        console.log(err)
      }
    }
  })
  return (
    <>
      <Header />
      <section className='mx-auto p-3 max-w-lg'>
        <h1 className='text-3xl text-center font-semibold my-7'>
          Hi {user?.firstname},This is your Profile
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className='flex-center flex-col gap-3 max-w-lg mx-auto'
        >
          <div className='flex-center'>
            <input
              type='file'
              ref={fileRef}
              onChange={e => {
                setFile(e.target.files[0])
              }}
              accept='image/*'
              hidden
            />
            <img
              value={formik.values.avatar}
              onBlur={formik.handleBlur('avatar')}
              onChange={formik.handleChange('avatar')}
              src={formData?.length > 0 ? formData : user?.avatar}
              onClick={() => fileRef?.current?.click()}
              className='w-24 h-24 mb-5 object-cover br-50 cursor-pointer'
              style={{ border: '4px solid white' }}
              alt='profile'
            />
          </div>

          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>
                Image successfully uploaded!
              </span>
            ) : (
              ''
            )}
          </p>

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
            value={`${isLoading ? 'Loading...' : 'Update Your Account'} `}
            className={`${
              isLoading
                ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                : ''
            }`}
            disabled={isLoading}
          />

          <Link
            to='/create-listing'
            className={`w-100 bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95 disabled:opacity-75 4`}
          >
            Create Listing
          </Link>
        </form>

        <Link to='/change-password' className='mt-5 text-sky-600'>
          Change Your Password
        </Link>

        <SignOut />

        {UserStates === undefined || userStates?.length === 0 ? (
          <button
            onClick={() => dispatch(userStates())}
            className='text-green-700 mt-5 flex-center m-auto text-center'
          >
            Show Listing
          </button>
        ) : (
          <div className='flex-center my-5 text-lg font-semibold'>
            Your listings
          </div>
        )}

        {UserStates?.map((item, index) => {
          return (
            <div
              key={index}
              className='between-center w-100 my-3 p-5 br-10'
              style={{ border: '1px dashed var(--checkbox-color)' }}
            >
              <Link to={`/listing/${item?._id}`} className='between-center'>
                <img
                  src={item?.images[0]}
                  className='h-16 w-16 object-contain rounded-lg mr-4'
                  alt='images'
                />
                <p>{item?.name}</p>
              </Link>

              <div className='between-center'>
                <Link to={`/update-listing/${item?._id}`}>
                  <BiEdit className=' text-blue-600 w-5 mr-3' />
                </Link>

                <CustomModal
                  buttonTitle={<AiFillDelete className='text-red-600 w-5' />}
                  content={'Are you Sure ,You want to delete this Listing?'}
                  ok={() => handelDeleteEstate(item?._id)}
                  open={openE}
                  cancel={cancelE}
                  showModal={showModalE}
                />
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}
export default Profile
