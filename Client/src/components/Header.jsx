import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [searchTerm, setSearch] = useState('')
  let authState = useSelector(state => state)
  let { user } = authState?.auth

  const getTokenFromLocalStorage = JSON.parse(
    localStorage?.getItem('customer')
  )?.token

  const handleSubmit = e => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFomUrl = urlParams.get('searchTerm')
    if (searchTermFomUrl) {
      setSearch(searchTermFomUrl)
    }
  }, [location.search])

  return (
    <section className='bg-slate-200 shadow-md'>
      <header className='mx-auto max-w-6xl p-3 flex justify-between items-center'>
        <Link to='/' className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>OAS</span>
          <span className='text-slate-700'>Estate</span>
        </Link>

        <form
          onSubmit={(e)=>handleSubmit(e)}
          className='flex items-center bg-slate-100 p-3 rounded-lg'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent w-24 sm:w-64 focus:outline-none'
            value={searchTerm}
            onChange={e => setSearch(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        <ul className='flex-center gap-4'>
          <li className='hidden sm:inline text-slate-700'>
            <Link className='hover:underline' to='/'>
              Home
            </Link>
          </li>
          <li className='hidden sm:inline text-slate-700'>
            <Link className='hover:underline' to='/about'>
              About
            </Link>
          </li>

          {getTokenFromLocalStorage ? (
            <li>
              <Link to='/profile'>
                <img
                  src={user?.avatar}
                  className='w-8 h-8 object-cover br-50'
                  style={{ border: '3px solid white' }}
                  alt='profile'
                />
              </Link>
            </li>
          ) : (
            <li className='text-slate-700'>
              <Link className='hover:underline' to='/login'>
                Login
              </Link>
            </li>
          )}
        </ul>
      </header>
    </section>
  )
}

export default Header
