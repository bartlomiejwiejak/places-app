import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom';

import Input from '../components/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../functions/validators';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import useHttp from '../hooks/useHttp';
import ErrorModal from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/auth-context';
import ImageUpload from '../components/ImageUpload';

function NewPlace() {

  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { userId, token } = useContext(AuthContext)
  const history = useHistory();

  const [formState, inputChange] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: '',
      isValid: false
    }
  }, false)
  const placeSubmitHandler = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', formState.inputs.title.value)
    formData.append('description', formState.inputs.description.value)
    formData.append('address', formState.inputs.address.value)
    formData.append('image', formState.inputs.image.value)
    formData.append('creator', userId)
    try {
      await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
        Authorization: 'Bearer ' + token
      })

      history.push('/');
    } catch (err) {

    }
  }

  return (
    <>
      {isLoading ? <LoadingSpinner asOverlay /> : null}
      <ErrorModal show={error} onCancel={clearError} />
      <form className='place-form' onSubmit={placeSubmitHandler}>
        <Input onInput={inputChange} id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' />
        <ImageUpload errorText='Please, provide an image.' onInput={inputChange} center id='image' />
        <Input onInput={inputChange} id='address' element='input' type='text' label='Adress' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid address.' />
        <Input onInput={inputChange} id='description' element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please, enter a valid description (at least 5 characters).' />
        <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </>
  )
}

export default NewPlace
