import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import Header from '../components/Header'
import 'swiper/css/bundle'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEstates, getestates } from '../features/estate/estateSlice'
import Estate from '../components/Estate'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const estatesState = useSelector(state => state?.listing?.getAllEstates)
  let offerLength = 0
  let saleLength = 0
  let rentLength = 0
  const images = [
    'https://firebasestorage.googleapis.com/v0/b/real-state-a4848.appspot.com/o/1716921864308home2.jpeg?alt=media&token=3b13de01-1c0b-46a5-8cbc-8b2b54bb4497',
    'https://firebasestorage.googleapis.com/v0/b/real-state-a4848.appspot.com/o/1716921864310home3.jpeg?alt=media&token=26a0215a-3901-49ca-b2d9-99e8e780f9e0',
    'https://firebasestorage.googleapis.com/v0/b/real-state-a4848.appspot.com/o/1716921864311home4.jpeg?alt=media&token=9168083e-f753-4319-8b6b-37aa89d2b0d2',
    'https://firebasestorage.googleapis.com/v0/b/real-state-a4848.appspot.com/o/1716921864312home5.jpeg?alt=media&token=ba7595b3-5582-4153-b1bc-8efa94d6ead7',
    'https://firebasestorage.googleapis.com/v0/b/real-state-a4848.appspot.com/o/1716921864312home6.jpeg?alt=media&token=6fbb8e1d-738e-4248-bcf7-ee371982dddd',
    'https://firebasestorage.googleapis.com/v0/b/real-state-a4848.appspot.com/o/1716921864313home7.jpeg?alt=media&token=d394d86b-045a-409a-ac3b-7f57478496b6'
  ]

  const handleShowOffer = () => {
    navigate('/search?offer=true')
    dispatch(getestates('/search?offer=true'))
  }

  const handleShowRent = () => {
    navigate('/search?type=Rent')
    dispatch(getestates('/search?type=Rent'))
  }

  const handleShowSale = () => {
    navigate('/search?type=Sale')
    dispatch(getestates('/search?type=Sale'))
  }

  SwiperCore.use([Navigation])

  useEffect(() => {
    dispatch(getAllEstates())
  }, [])

  return (
    <>
      <Header />
      <>
        <div className='flex flex-col p-28 px-3 gap-6 max-w-6xl mx-auto'>
          <h1 className='font-bold text-3xl lg:text-6xl text-slate-700'>
            Find your next <span className='text-slate-500'>perfect</span>
            <br />
            place with ease
          </h1>

          <div className='text-gray-500 sm:text-sm text-xs'>
            Sahand Estate will help you find your home fast, easy and
            comfortable.
            <br />
            Our expert support are always available.
          </div>

          <Link
            to={`/search`}
            className='text-xs sm:text-sm hover:underline font-bold text-blue-800'
          >
            Let's Start now...
          </Link>
        </div>

        <Swiper navigation>
          {images?.map((image, index) => {
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

        <div className='flex flex-1 my-10 max-w-6xl mx-auto flex-col gap-8 p-3'>
          {/* Offer */}
          <div className='flex flex-col'>
            <div className='my-3'>
              <h2 className='text-slate-600 font-semibold text-2xl'>
                Recent offers
              </h2>
              <button
                onClick={() => handleShowOffer()}
                className='text-blue-800 hover:underline'
              >
                Show more offers
              </button>
              <div className='flex gap-4 my-4 w-100 flex-wrap'>
                {estatesState?.map((item, index) => {
                  while (item?.offer === true) {
                    offerLength++
                    return (
                      item &&
                      item?.offer === true &&
                      offerLength < 5 && (
                        <Estate item={item} key={`${index}_kng`} />
                      )
                    )
                  }
                })}
              </div>
            </div>
          </div>

          {/* Rent */}
          <div className='flex flex-col'>
            <div className='my-3'>
              <h2 className='text-slate-600 font-semibold text-2xl'>
                Recent places for rent
              </h2>
              <button
                onClick={() => handleShowRent()}
                className='text-blue-800 hover:underline'
              >
                Show more places for rent
              </button>
              <div className='flex gap-4 my-4 w-100 flex-wrap'>
                {estatesState?.map((item, index) => {
                  while (item?.type === 'Rent') {
                    rentLength++
                    return (
                      item &&
                      item?.type === 'Rent' &&
                      rentLength < 5 && (
                        <Estate item={item} key={`${index}_kng`} />
                      )
                    )
                  }
                })}
              </div>
            </div>
          </div>

          {/* Sale */}
          <div className='flex flex-col'>
            <div className='my-3'>
              <h2 className='text-slate-600 font-semibold text-2xl'>
                Recent places for sale
              </h2>
              <button
                onClick={() => handleShowSale()}
                className='text-blue-800 hover:underline'
              >
                Show more places for sale
              </button>
              <div className='flex gap-4 my-4 w-100 flex-wrap'>
                {estatesState?.map((item, index) => {
                  while (item?.type === 'Sale') {
                    saleLength++
                    return (
                      item &&
                      item?.type === 'Sale' &&
                      saleLength < 5 && (
                        <Estate item={item} key={`${index}_kng`} />
                      )
                    )
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  )
}

export default Home
