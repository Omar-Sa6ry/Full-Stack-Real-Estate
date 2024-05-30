import React from 'react'
import { Link } from 'react-router-dom'

const LinkAuth = props => {
  const { to, hidden, value, className } = props
  return (
    <Link
      to={to}
      hidden={hidden || false}
      className={`w-100 bg-slate-700 text-center text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75 4 ${className}`}
    >
      {value}
    </Link>
  )
}

export default LinkAuth
