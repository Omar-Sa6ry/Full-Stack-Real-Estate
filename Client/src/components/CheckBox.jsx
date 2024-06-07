import React from 'react'
import '../css/checkbox.css'

const CheckBox = props => {
  const {
    val,
    defaultChecked,
    id,
    defaultValue,
    checked,
    value,
    onBlur,
    onChange,
    none
  } = props

  return (
    <div className={`checkbox-wrapper m-4 ml-4 ${none}`}>
      <input
        type='checkbox'
        id={id}
        name={val}
        value={value}
        defaultValue={defaultValue}
        defaultChecked={defaultChecked}
        onBlur={onBlur}
        onChange={onChange}
        checked={checked}
      />
      <label className='terms-label' htmlFor={id}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 200 200'
          className='checkbox-svg'
        >
          <mask fill='white' id='path-1-inside-1_476_5-37'>
            <rect height='200' width='200'></rect>
          </mask>
          <rect
            mask='url(#path-1-inside-1_476_5-37)'
            strokeWidth='40'
            className='checkbox-box'
            height='200'
            width='200'
          ></rect>
          <path
            strokeWidth='15'
            d='M52 111.018L76.9867 136L149 64'
            className='checkbox-tick'
          ></path>
        </svg>
        <span className='label-text'>{val}</span>
      </label>
    </div>
  )
}

export default CheckBox
