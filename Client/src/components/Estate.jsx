import React from 'react'
import { Link } from 'react-router-dom'
import { IoLocation } from 'react-icons/io5'
import { LiaBedSolid, LiaBathSolid } from 'react-icons/lia'

const Estate = props => {
  const { index, item } = props

  return (
    <Link
      key={index}
      to={`/listing/${item?._id}`}
      className='bg-white shadow-md hover:shadow-lg w-full transition-shadow overflow-hidden br-10 sm:max-w-[365px] md:max-w-[332px] md:justify-center'
    >
      <img
        src={
          item?.images?.length > 0
            ? item?.images[0]
            : 'https://th.bing.com/th/id/OIP.bh4A75K-JyAQ9nxnS7nfJgHaE8?rs=1&pid=ImgDetMain'
        }
        className={
          'h-[320px] w-full object-cover hover:scale-105 duration-300 transition-scale'
        }
        alt='Image Cover'
      />

      <div className='p-3 flex flex-col w-full gap-2'>
        <p className='truncate font-semibold text-lg text-slate-700'>
          {item?.name}
        </p>

        <p className='flex flex-row gap-2 w-full items-center'>
          <IoLocation className='text-green-700 h-4 w-4' />
          <span className='truncate text-gray-700 text-sm'>
            {item?.address}
          </span>
        </p>

        <p className='text-sm text-gray-600 line-clamp-2'>
          {item?.description}
        </p>

        <p className='font-semibold mt-2 text-slate-500'>
          ${' '}
          {item?.offer
            ? item?.discountPrice?.toLocaleString('en-US')
            : item?.regularPrice?.toLocaleString('en-US')}
          {item?.type === 'Rent' && '/ Month'}
        </p>

        <ul className='font-bold gap-4 flex flex-row text-xs items-center text-slate-700'>
          <li className='flex flex-row gap-1 items-center'>
            <LiaBedSolid className='font-bold w-4 h-4' />
            {item?.beds > 1 ? `${item?.beds} Beds` : '1 Bed'}
          </li>
          <li className='flex flex-row gap-1 items-center'>
            <LiaBathSolid className='font-bold w-4 h-4' />
            {item?.baths > 1 ? `${item?.baths} Baths` : '1 Bath'}
          </li>
        </ul>
      </div>
    </Link>
  )
}

export default Estate
