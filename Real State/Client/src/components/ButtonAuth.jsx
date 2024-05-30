import React from 'react'

const ButtonAuth = props => {
  const { type, onClick, hidden, value, disabled, className } = props
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      hidden={hidden}
      className={`w-100 bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75 4 ${className}`}
    >
      {value}
    </button>
  )
}

export default ButtonAuth
