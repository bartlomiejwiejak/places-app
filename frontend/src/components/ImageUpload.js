import React, { useRef } from 'react'
import Button from './Button'

function ImageUpload({ center, id }) {

  const filePickerRef = useRef()

  const pickedHandler = event => {

  }

  const pickImageHandler = () => {
    filePickerRef.current.click()
  }

  return (
    <div className='form-control'>
      <input
        id={id}
        ref={filePickerRef}
        type='file'
        style={{ display: 'none' }}
        accept='.jpt,.png,.jpeg'
        onChange={pickImageHandler}
      />
      <div className={`image-upload ${center && 'center'}`}>
        <div className='image-upload__preview'></div>
        <img src='' alt='Preview' />
      </div>
      <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
    </div>
  )
}

export default ImageUpload
