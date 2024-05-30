import React from 'react'

const InputNumber = props => {
  const { val, label, className, min, defaultValue, onChange, onBlur, value } =
    props

  return (
    <div className={`m-3 flex-center flex-row ${className}`}>
      <input
        id={val}
        name={val}
        value={value}
        onBlur={onBlur}
        defaultValue={defaultValue}
        onChange={onChange}
        type='number'
        min={min}
        className='outline-none br-10 mr-4 w-24 py-2 px-4 rounded'
      />
      <label htmlFor={val}>{label}</label>
    </div>
  )
}

export default InputNumber
