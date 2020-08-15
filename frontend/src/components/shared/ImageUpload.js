import React, { useRef, useState, useEffect } from 'react'

import Button from './Button'

function ImageUpload({ center, id, onInput, errorText }) {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef()

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      }
      fileReader.readAsDataURL(file);
    }
  }, [file])

  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true)
      fileIsValid = true;
    } else {
      setIsValid(false)
      setFile(null);
      setPreviewUrl(null);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid)
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
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}</div>
        {!previewUrl && <p>Please pick an image.</p>}
      </div>
      <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
      {!isValid && <p>{errorText}</p>}
    </div>
  )
}

export default ImageUpload
