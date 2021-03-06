import React, { useRef, useState, useEffect } from 'react'

import Button from './Button'

function ImageUpload({ center, id, onInput, errorText, initialValue, valid, style }) {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(initialValue && `http://192.168.8.132:5000/${initialValue}`);
  const [isValid, setIsValid] = useState(valid);

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
        accept='.jpt,.png,.jpeg,.jpg'
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && 'center'}`}>
        <div style={style ? style : {}} className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}</div>
        {!isValid && <p className='image-upload__error-text'>{errorText}</p>}
        <Button className='btn--blue btn--small' onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
    </div>
  )
}

export default ImageUpload
