import React from 'react'
import { Button, Modal } from 'antd'

const CustomModal = props => {
  const { buttonTitle, className, content, open, ok, cancel, showModal } = props
  return (
    <>
      <Button
        type='primary'
        onClick={showModal}
        className={`text-red-700 cursor-pointer bg-transparent shadow-none text-base font-medium m-0 p-0 ${className}`}
      >
        {buttonTitle}
      </Button>
      <Modal title='Warning ...' open={open} onOk={ok} onCancel={cancel}>
        <p>{content}</p>
      </Modal>
    </>
  )
}

export default CustomModal
