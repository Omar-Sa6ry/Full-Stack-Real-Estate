import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAnEstate, getEmail } from '../features/estate/estateSlice'
import { IoLocationSharp } from 'react-icons/io5'
import { LiaBedSolid, LiaBathSolid } from 'react-icons/lia'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { FaChair } from 'react-icons/fa6'
import { RiParkingBoxFill } from 'react-icons/ri'
import Header from '../components/Header'
import ButtonAuth from '../components/ButtonAuth'
import InputAuth from '../components/InputAuth'
import SwiperCore from 'swiper'
import LinkAuth from '../components/LinkAuth'
import 'swiper/css/bundle'

const SingleListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [msg, setMSG] = useState(false)
  const [click, setClick] = useState(false)

  SwiperCore.use([Navigation])
  let getId = location?.pathname?.split('/')[2]
  const listingState = useSelector(state => state)
  let { Estate, isError, Email } = listingState?.listing
  let getTokenFromLocalStorage = JSON.parse(
    localStorage?.getItem('customer')
  )?.token

  useEffect(() => {
    if (getId !== undefined) {
      dispatch(getAnEstate(getId))
    }
  }, [getId])

  useEffect(() => {
    if (Estate) {
      dispatch(getEmail(Estate?.owner))
    }
  }, [Estate])

  useEffect(() => {
    if (isError) {
      navigate('/')
    }
  }, [isError])

  return (
    <>
      <Header />

      <Swiper navigation>
        {Estate?.images?.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className='h-[500px]'
                style={{
                  background: `url(${image}) center no-repeat`,
                  backgroundSize: 'cover'
                }}
              ></div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      <div className='flex flex-col  max-w-4xl mx-auto p-3 my-7 gap-6'>
        <h1 className='text-2xl font-medium'>
          {Estate?.name}-
          {Estate?.discountPrice
            ? Estate?.discountPrice
            : Estate?.regularPrice?.toLocaleString('en-US')}
        </h1>

        <p className='text-green-700 text-sm items-center flex font-semibold'>
          <IoLocationSharp />
          {Estate?.address}
        </p>

        <div className='flex flex-col sm:flex-row flex-1 space-x-4 max-w-lg'>
          <span className='color-white ml-4 sm:ml-0 sm:mb-0 mb-2 w-100 text-center p-1 br-6 max-w-[200px] bg-red-800'>
            For {Estate?.type}
          </span>

          {Estate?.offer && (
            <span className='p-1 w-100 color-white text-center br-6 max-w-[200px] bg-green-800'>
              $&nbsp;{' '}
              {(Estate?.regularPrice - Estate?.discountPrice)?.toLocaleString(
                'en-US'
              )}
              &nbsp; discount
            </span>
          )}
        </div>

        <p className='text-slate-800 flex flex-wrap'>
          <span className='text-black font-semibold'>Description</span>&nbsp; -
          &nbsp;
          <span>{Estate?.description}</span>
        </p>

        <ul className='flex flex-1 flex-col max-w-lg text-green-700 sm:flex-row'>
          <li className='flex-wrap flex sm:flex-center text-center my-3 mr-5'>
            <LiaBedSolid className='mb-2 w-6' /> &nbsp;
            {Estate?.beds > 1 ? `${Estate?.beds} Beds` : `1 Bed`}
          </li>

          <li className='sm:flex-center flex flex-wrap text-center my-3 mr-5'>
            <LiaBathSolid className='mb-2 w-6' /> &nbsp;
            {Estate?.baths > 1 ? `${Estate?.baths} Baths` : `1 Bath`}
          </li>

          <li className='sm:flex-center flex flex-wrap text-center my-3 mr-5'>
            <RiParkingBoxFill className='mb-2 w-6' /> &nbsp;
            {Estate?.parking ? `Parking` : `No Parking`}
          </li>

          <li className='flex-wrap flex sm:flex-center my-3 text-center'>
            <FaChair className='mb-2 w-6' />
            &nbsp;
            {Estate?.furnished ? '' : 'No'} Furnished
          </li>
        </ul>

        <form className='gap-4 flex flex-col w-100 flex-1'>
          {getTokenFromLocalStorage ? (
            <>
              {click && (
                <>
                  <p className='flex text-lg'>
                    Contact for &nbsp; &nbsp;
                    <span className='font-semibold'>{Estate?.name}</span>
                  </p>
                  <InputAuth
                    placeholder='Enter Your message here...'
                    id='msg'
                    type='text'
                    onChange={e => setMSG(e?.target?.value)}
                    className={'my-2 h-20'}
                  />
                </>
              )}

              <ButtonAuth
                type={'button'}
                hidden={click === true}
                onClick={() => setClick(true)}
                value={`${click ? 'Send message' : 'Contact Landlord'} `}
              />
              {click && msg && (
                <LinkAuth
                  value={'Send Masaage'}
                  to={`mailto:${Email}?subject=Regarding ${Estate?.name}&body=${msg}`}
                />
              )}
            </>
          ) : (
            <Link className='underline text-cyan-700' to={'/login'}>
              Go to login page to be able to send message
            </Link>
          )}
        </form>
      </div>
    </>
  )
}

export default SingleListing










// import React, { useEffect, useState } from 'react'
// import Header from '../components/Header'
// import Loading from '../components/Loading'
// import InputAuth from '../components/InputAuth'
// import CheckBox from '../components/CheckBox'
// import ButtonAuth from '../components/ButtonAuth'
// import { useDispatch, useSelector } from 'react-redux'
// import { useFormik } from 'formik'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { getestates } from '../features/estate/estateSlice'
// import Estate from '../components/Estate'

// const Search = () => {
//   const dispatch = useDispatch()
//   const location = useLocation()
//   const navigate = useNavigate()

//   const [type, setType] = useState('all')
//   const [sort, setSort] = useState('createdAt')
//   const [parking, setParking] = useState(false)
//   const [furnished, setFurnished] = useState(false)
//   const [offer, setOffer] = useState(false)
//   const [order, setOrder] = useState('desc')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [value, setValue] = useState('')
//   const [seeMore, setSeeMore] = useState(false)

//   const urlParams = new URLSearchParams(location.search)
//   var estatesState = useSelector(state => state?.listing?.getAllEstates)
//   const listingState = useSelector(state => state)
//   let { isLoading } = listingState?.listing
//   const [listing, setListing] = useState([])

//   const handelType = e => {
//     if (
//       e?.target?.id === 'Sale' ||
//       e?.target?.id === 'Rent' ||
//       e?.target?.id === 'all'
//     ) {
//       setType(e?.target?.id)
//     }
//   }

//   const handleSelect = e => {
//     setSort(e.target.value.split('_')[0] || 'created_at')
//     setOrder(e.target.value.split('_')[1] || 'desc')
//     setValue(e.target.value)
//   }

//   const handleSeeMore = async () => {
//     const numberOfListing = listing?.length
//     const startIndex = numberOfListing

//     console.log(numberOfListing)
//     console.log(startIndex)
//     const urlParams = new URLSearchParams(location.search)
//     urlParams.set('startIndex', startIndex)
//     const query = urlParams.toString()

//     dispatch(getestates(query))
//     estatesState = await listingState?.listing?.getAllEstates
//     console.log(estatesState)
//     if (estatesState?.length < 9) {
//       setSeeMore(false)
//     } else {
//       setSeeMore(true)
//     }
//     setListing([...listing, ...estatesState])
//     console.log(listing)
//   }

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       searchTerm: searchTerm || '',
//       furnished: furnished || false,
//       parking: parking,
//       offer: offer || false,
//       regularPrice: 0
//     },
//     onSubmit: async values => {
//       urlParams.set('type', type)
//       urlParams.set('sort', sort)
//       urlParams.set('order', order)
//       urlParams.set('parking', values.parking)
//       urlParams.set('furnished', values.furnished)
//       urlParams.set('offer', values.offer)
//       urlParams.set('searchTerm', values.searchTerm)
//       const query = urlParams.toString()

//       dispatch(getestates(query))
//       navigate(`/search?${query}`)
//       let estatesState = await listingState?.listing?.getAllEstates
//       console.log(estatesState)
//       estatesState?.length > 8 ? setSeeMore(true) : setSeeMore(false)
//       setListing([...estatesState])
//       setValue(sort + '_' + order)
//     }
//   })

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search)
//     setSearchTerm(
//       urlParams.get('searchTerm') === null ? '' : urlParams.get('searchTerm')
//     )
//     setParking(
//       urlParams.get('parking') === null ? false : urlParams.get('parking')
//     )
//     setFurnished(
//       urlParams.get('furnished') === null ? false : urlParams.get('furnished')
//     )
//     setSort(
//       urlParams.get('sort') === null ? 'createdAt' : urlParams.get('sort')
//     )
//     setType(urlParams.get('type') === null ? 'all' : urlParams.get('type'))
//     setOffer(urlParams.get('offer') === null ? false : urlParams.get('offer'))
//     setOrder(urlParams.get('order') === null ? 'desc' : urlParams.get('order'))

//     // dispatch(getestates(query))
//   }, [location.search])

//   console.log(listing)
//   useEffect(() => {
//     dispatch(getestates())
//     // setListing(estatesState)
//   }, [])

//   useEffect(() => {
//     setValue(sort + '_' + order)
//   }, [sort, order])

//   return (
//     <>
//       <Header />
//       <div className='flex flex-col md:flex-row'>
//         <div className='flex flex-col md:flex-row'>
//           <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
//             <form
//               onSubmit={formik.handleSubmit}
//               className='gap-8 flex-col flex'
//             >
//               <div className='flex items-center gap-2'>
//                 <label className='whitespace-nowrap font-semibold'>
//                   Search Term:
//                 </label>
//                 <InputAuth
//                   value={searchTerm}
//                   onChange={e => setSearchTerm(e?.target?.value)}
//                   placeholder='Search...'
//                   id='password'
//                   type='text'
//                 />
//               </div>
//               <div className='flex gap-2 items-center flex-wrap'>
//                 <label className='font-semibold'>Type: </label>

//                 <CheckBox
//                   val={'Rent & Sale'}
//                   id={'all'}
//                   value={formik?.values?.type === 'all'}
//                   onChange={handelType}
//                   onBlur={formik.handleBlur('type')}
//                   checked={type === undefined || type === 'all'}
//                 />

//                 <CheckBox
//                   val={'Rent'}
//                   id={'Rent'}
//                   value={formik?.values?.type === 'Rent'}
//                   onChange={handelType}
//                   onBlur={formik.handleBlur('type')}
//                   checked={type === 'Rent'}
//                 />

//                 <CheckBox
//                   val={'Sale'}
//                   id={'Sale'}
//                   value={formik?.values?.type === 'Sale'}
//                   onChange={handelType}
//                   onBlur={formik.handleBlur('type')}
//                   checked={type === 'Sale'}
//                 />

//                 <CheckBox
//                   val={'Offer'}
//                   id={'Offer'}
//                   value={formik?.values?.offer}
//                   onChange={formik.handleChange('offer')}
//                   onBlur={formik.handleBlur('offer')}
//                   defaultChecked={urlParams.get('offer') === 'true'}
//                 />
//               </div>
//               <div className='flex gap-2 items-center flex-wrap'>
//                 <label className='font-semibold'>Amenities:</label>
//                 <CheckBox
//                   val={'Parking'}
//                   id={'Parking'}
//                   value={formik?.values?.parking}
//                   onChange={formik.handleChange('parking')}
//                   onBlur={formik.handleBlur('parking')}
//                   defaultChecked={urlParams.get('parking') === 'true'}
//                 />

//                 <CheckBox
//                   val={'Furnished'}
//                   id={'Furnished'}
//                   defaultChecked={urlParams.get('furnished') === 'true'}
//                   value={formik.values.furnished}
//                   onChange={formik.handleChange('furnished')}
//                   onBlur={formik.handleBlur('furnished')}
//                 />
//               </div>

//               <div className='flex items-center gap-2'>
//                 <label className='whitespace-nowrap font-semibold'>
//                   Sort:{' '}
//                 </label>
//                 <select
//                   id={'sort_id'}
//                   onChange={e => handleSelect(e)}
//                   defaultValue={value}
//                   className='rounded-lg p-3 w-50 outline-none'
//                 >
//                   <option
//                     selected={value === 'regularPrice_desc'}
//                     value='regularPrice_desc'
//                   >
//                     Price high to low
//                   </option>
//                   <option
//                     selected={value === 'regularPrice_asc'}
//                     value='regularPrice_asc'
//                   >
//                     Price low to hight
//                   </option>
//                   <option
//                     selected={value === 'createdAt_desc'}
//                     value='createdAt_desc'
//                   >
//                     Latest
//                   </option>
//                   <option
//                     selected={value === 'createdAt_asc'}
//                     value='createdAt_asc'
//                   >
//                     Oldest
//                   </option>
//                 </select>
//               </div>

//               <ButtonAuth
//                 type='submit'
//                 value={`${isLoading ? 'Loading' : 'Search'} `}
//                 className={`${
//                   isLoading
//                     ? 'opacity-75 hover:placeholder-opacity-75 cursor-not-allowed'
//                     : ''
//                 }`}
//                 disabled={isLoading}
//               />
//             </form>
//           </div>
//         </div>

//         <div className='flex flex-col flex-1' style={{ maxWidth: '66%' }}>
//           <h1 className='mt-5 text-3xl text-slate-700 border-b p-3 font-semibold'>
//             Listing Results:
//           </h1>

//           <div className='w-100 p-7 h-screen'>
//             {isLoading ? (
//               <div className='flex-center my-auto h-screen'>
//                 <Loading />
//               </div>
//             ) : listing?.length > 0 ? (
//               <div className='flex gap-4 w-100 flex-wrap'>
//                 {listing?.map((item, index) => {
//                   return <Estate item={item} key={index} />
//                 })}
//               </div>
//             ) : listing?.length === 0 ? (
//               <p className='w-100 flex-center text-red-600 m-auto text-3xl h-screen font-bold'>
//                 No Listing Found to show
//               </p>
//             ) : (
//               <p className='w-100 flex-center text-red-600 m-auto text-3xl h-screen font-bold'>
//                 Enter on Button Search to find what you want
//               </p>
//             )}

//             {seeMore && (
//               <button
//                 className='w-full text-green-800 text-lg text-center font-bold hover:underline my-7'
//                 onClick={() => handleSeeMore()}
//               >
//                 See More
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Search
