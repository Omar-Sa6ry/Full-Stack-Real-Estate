import React from 'react'

const InputAuth = props => {
  const {
    name,
    placeholder,
    type,
    style,
    id,
    value,
    onChange,
    defaultValue,
    onBlur,
    className
  } = props
  return (
    <input
      id={id}
      name={name}
      type={type}
      style={style}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`rounded-lg p-3 w-100 outline-none ${className}`}
    />
  )
}

export default InputAuth
