import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { app } from '../components/FireBaseConfig'
import { MdDelete } from 'react-icons/md'
import { useFormik } from 'formik'
import * as yup from 'yup'
import InputAuth from '../components/InputAuth'
import CheckBox from '../components/CheckBox'
import InputNumber from '../components/InputNumber'
import Header from '../components/Header'
import CustomModal from '../components/Modal'
import ButtonAuth from '../components/ButtonAuth'
import {
  createEstate,
  getAnEstate,
  udateAnEstate
} from '../features/estate/estateSlice'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage'
import '../css/upload.css'

let schema = yup.object().shape({
  name: yup.string().required('Name is Required').min(10).max(62),
  description: yup.string().required('Description is Required'),
  address: yup.string().required('Address is Required'),
  furnished: yup.boolean().default(false),
  parking: yup.boolean().default(false),
  offer: yup.boolean().default(false),
  regularPrice: yup
    .number()
    .required('Regular Price is Required')
    .min(50, 'Regular Price must be greater than or equal to 50'),
  beds: yup
    .number()
    .required('Bedrooms is Required')
    .min(1, 'Bedrooms must be greater than or equal to 1'),
  baths: yup
    .number()
    .required('Bathroom is Required')
    .min(1, 'Bathroom must be greater than or equal to 1')
})

const CreateListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  let getId = location?.pathname?.split('/')[2]

  const listingState = useSelector(state => state)
  let { isLoading, Estate, isSuccess, CreateEstate } = listingState?.listing

  if (getId === undefined) {
    Estate = undefined
  }

  const fileRef = useRef(null)
  const [success, setSuccess] = useState(false)
  const [file, setFile] = useState(undefined)
  const [type, setType] = useState('Rent')
  const [discount, setDiscount] = useState(false)
  const [offer, setOffer] = useState(0)
  const [images, setImages] = useState([])
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [openI, setopenI] = useState(false)

  const showModalI = () => {
    setopenI(true)
  }

  const cancelI = () => {
    setopenI(false)
  }

  const handelDeleteImage = image => {
    setImages(images.filter(item => item !== image))
    setopenI(false)
  }

  const handelType = e => {
    if (e?.target?.id === 'Sale' || e?.target?.id === 'Rent') {
      setType(e?.target?.id)
    }
  }

  const handelDiscount = e => {
    if (e?.target?.id === 'Offer') {
      setDiscount(true)
    }
  }

  const titleOfRegulalPrice = () => {
    return (
      <p className='text-sm'>
        Regular price
        <p className='text-xs flex-center'>($ / Month)</p>
      </p>
    )
  }

  const titleOfDiscountPrice = () => {
    return (
      <p className='text-sm'>
        Discounted price
        <p className='text-xs flex-center'>($ / Month)</p>
      </p>
    )
  }

  const handleImageSubmit = e => {
    if (file?.length > 0 && file.length < 7) {
      setUploading(true)
      setImageUploadError(false)
      const promises = []

      for (let i = 0; i < file?.length; i++) {
        promises.push(storeImage(file[i]))
      }
      Promise.all(promises)
        .then(urls => {
          setImages([...images, ...urls])
          setImageUploadError(false)
          setUploading(false)
        })
        .catch(err => {
          console.log(err)
          setImageUploadError('Image upload failed (2 mb max per image)')
          setUploading(false)
        })
    } else {
      setImageUploadError('You can only upload 6 images per listing')
      setUploading(false)
    }
  }

  const storeImage = file => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(progress)
        },
        error => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>
            resolve(downloadURL)
          )
        }
      )
    })
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: Estate?.name || '',
      description: Estate?.description || '',
      furnished: Estate?.furnished || false,
      parking: Estate?.parking || false,
      address: Estate?.address || '',
      type: Estate?.type ? Estate?.type : 'Rent',
      regularPrice: Estate?.regularPrice || 50,
      beds: Estate?.beds || 1,
      baths: Estate?.baths || 1
    },
    validationSchema: schema,
    onSubmit: async values => {
      if (images?.length === 0) {
        toast.error('Upload at least one photo')
      } else if (images?.length > 6) {
        toast.error('Upload maxium six photo')
      } else {
        values.type = type
        values.images = images
        values.discountPrice = Number(offer)
        if (Number(offer) === 0) {
          values.offer = false
        } else {
          values.offer = true
        }
        if (!getId) {
          await dispatch(createEstate(values))
        } else {
          const data = { id: getId, estateData: values }
          dispatch(udateAnEstate(data))
        }

        const CreateEstate = await listingState?.listing?.CreateEstate?._id
        setSuccess(await listingState?.listing?.isSuccess)

        if (isSuccess) {
          navigate(`/listing/${getId || CreateEstate}`)
        }
      }
    }
  })

  useEffect(() => {
    if (file) {
      handleImageSubmit(file)
    }
  }, [file])

  useEffect(() => {
    handelType()
  }, [type])

  useEffect(() => {
    handelDiscount()
  }, [discount])

  useEffect(() => {
    if (getId !== undefined) {
      dispatch(getAnEstate(getId))
      setImages(Estate?.images)
    }
  }, [getId])

  useEffect(() => {
    if (Estate !== undefined) {
      setImages(Estate?.images)
      setType(Estate?.type)
      setOffer(Estate?.offer)
    }
  }, [Estate])

  useEffect(() => {
    if (success) {
      setSuccess(false)
      navigate(`/listing/${CreateEstate?._id}`)
      console.log(success)
    }
  }, [success])

  return (
    <>
      <Header />
      <section className='mx-auto max-w-4xl p-3'>
        <h1 className='my-7 text-3xl text-center font-semibold'>
          {getId ? 'Update' : 'Create'} Listing
        </h1>
        <form
          className='flex flex-col sm:flex-row gap-4'
          onSubmit={formik.handleSubmit}
        >
          <div className='flex gap-4 h-fit flex-1 flex-col'>
            <InputAuth
              type='text'
              placeholder='Name...'
              id='name'
              value={formik.values.name}
              onChange={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
            />
            <InputAuth
              className='h-16'
              type='text'
              placeholder='Description...'
              id='description'
              value={formik.values.description}
              onChange={formik.handleChange('description')}
              onBlur={formik.handleBlur('description')}
            />
            <InputAuth
              type='text'
              placeholder='Address...'
              id='address'
              defaultValue={formik.values.address}
              value={formik.values.address}
              onChange={formik.handleChange('address')}
              onBlur={formik.handleBlur('address')}
            />

            <div className='between-center flex-1 flex-row flex-wrap mt-3'>
              <CheckBox
                val={'Rent'}
                id={'Rent'}
                defaultChecked={type}
                value={formik?.values?.type === 'Rent'}
                onChange={handelType}
                onBlur={formik.handleBlur('type')}
                checked={type === undefined || type === 'Rent'}
              />

              <CheckBox
                val={'Sale'}
                id={'Sale'}
                value={type}
                defaultChecked={Estate?.type === 'Sale'}
                onChange={handelType}
                onBlur={formik.handleBlur('type')}
                checked={type === 'Sale'}
              />

              <CheckBox
                id={'Parking'}
                val={'Parking'}
                defaultChecked={Estate?.parking}
                value={formik.values.parking}
                onChange={formik.handleChange('parking')}
                onBlur={formik.handleBlur('parking')}
                checked={formik.values.parking}
              />

              <CheckBox
                id={'furnished'}
                val={'furnished'}
                value={formik.values.furnished}
                defaultChecked={Estate?.furnished}
                onChange={formik.handleChange('furnished')}
                onBlur={formik.handleBlur('furnished')}
                checked={formik.values.furnished}
              />

              <CheckBox
                val={'Offer'}
                id={'Offer'}
                // defaultChecked={Estate?.offer === true}
                value={discount}
                onChange={handelDiscount}
                onBlur={formik.handleBlur('offer')}
                defaultChecked={
                  formik.values.offer || discount || Estate?.offer
                }
              />
            </div>

            <div className='flex flex-wrap justify-between sm:flex-row'>
              <InputNumber
                val={'Beds'}
                label={'Beds'}
                defaultValue={'1'}
                min={'1'}
                value={formik?.values?.beds || 1}
                onChange={formik.handleChange('beds')}
                onBlur={formik.handleBlur('beds')}
              />
              <InputNumber
                val={'Baths'}
                label={'Baths'}
                min={'1'}
                value={formik.values.baths || 1}
                onChange={formik.handleChange('baths')}
                onBlur={formik.handleBlur('baths')}
              />
              <InputNumber
                val={'Regular Price'}
                label={titleOfRegulalPrice()}
                min={'50'}
                value={formik.values.regularPrice || 50}
                onChange={formik.handleChange('regularPrice')}
                onBlur={formik.handleBlur('regularPrice')}
              />

              {(Estate?.offer || discount) && (
                <InputNumber
                  defaultValue={Estate?.discountPrice || 0}
                  value={offer}
                  min={'0'}
                  label={titleOfDiscountPrice()}
                  onChange={e => setOffer(e?.target?.value)}
                  val={'Discount Price'}
                />
              )}
            </div>
          </div>
          <div className='flex gap-4 flex-1 flex-col'>
            <div className='flex'>
              <p className='font-semibold'>
                Images :
                <span className='font-normal ml-2 text-gray-700'>
                  The first image will be the cover (max 6)
                </span>
              </p>
            </div>

            {/* image */}
            <div className='mt-5'>
              <input
                ref={fileRef}
                onChange={e => {
                  setFile(e.target.files)
                }}
                type='file'
                accept='image/*'
                multiple
                hidden
              />

              <button
                disabled={uploading}
                onClick={() => {
                  fileRef?.current?.click()
                  handleImageSubmit()
                }}
                type='button'
                className={`${
                  uploading || isLoading
                    ? 'cssbuttons-io-buttonr opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                    : 'cssbuttons-io-buttonr'
                }`}
              >
                <svg
                  viewBox='0 0 640 512'
                  fill='white'
                  height='1em'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z'></path>
                </svg>
                <span>
                  {`${uploading ? 'wait few secounds ...' : 'Upload Image'}`}
                </span>
              </button>
            </div>

            {/* Show Images */}
            {images?.length > 0 && (
              <div className='flex flex-col flex-1 flex-wrap gap-4'>
                {images?.map((image, index) => {
                  return (
                    <div
                      key={index}
                      className='br-10 between-center w-100 p-4'
                      style={{ border: '1px dashed var(--checkbox-color)' }}
                    >
                      <img
                        key={index}
                        src={image}
                        className='w-20 h-20 object-contain rounded-lg'
                        alt='image'
                      />

                      <CustomModal
                        buttonTitle={<MdDelete className='w-5' />}
                        content={'Are you Sure ,You want to delete this Image?'}
                        ok={() => handelDeleteImage(image)}
                        open={openI}
                        cancel={cancelI}
                        showModal={showModalI}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Errors */}
            <div className='flex flex-col w-100'>
              <div className='error'>
                {formik.touched.baths && formik.errors.baths}
              </div>
              <div className='error'>
                {formik.touched.beds && formik.errors.beds}
              </div>
              <div className='error'>
                {formik.touched.address && formik.errors.address}
              </div>
              <div className='error'>
                {formik.touched.name && formik.errors.name}
              </div>
              <div className='error'>
                {formik.touched.description && formik.errors.description}
              </div>
              <div className='error'>
                {formik.touched.type && formik.errors.type}
              </div>
              <div className='error'>
                {formik.touched.regularPrice && formik.errors.regularPrice}
              </div>
              <div className='error'>
                {formik.touched.furnished && formik.errors.furnished}
              </div>
              <div className='error'>
                {formik.touched.offer && formik.errors.offer}
              </div>
              <div className='error'>
                {formik.touched.parking && formik.errors.parking}
              </div>
              {images?.length > 6 && (
                <div className='error'>
                  Images must be less than or equal to 6
                </div>
              )}
              <div className='error'>
                {imageUploadError && imageUploadError}
              </div>
            </div>

            <ButtonAuth
              type='submit'
              value={`${
                uploading
                  ? 'wait until the images are uploaded...'
                  : isLoading
                  ? 'Loading'
                  : getId !== undefined
                  ? 'Update Listing'
                  : 'Create Listing'
              } `}
              className={`normal-case ${
                uploading || isLoading
                  ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
                  : ''
              }`}
              disabled={isLoading || uploading}
            />
          </div>
        </form>
      </section>
    </>
  )
}

export default CreateListing
