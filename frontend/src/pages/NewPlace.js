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

function NewPlace() {

  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { userId } = useContext(AuthContext)
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
    }
  }, false)
  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest('http://localhost:5000/api/places', 'POST', JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
        creator: userId
      }), {
        'Content-Type': 'application/json'
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
        <Input onInput={inputChange} id='address' element='input' type='text' label='Adress' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid address.' />
        <Input onInput={inputChange} id='description' element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please, enter a valid description (at least 5 characters).' />
        <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </>
  )
}

export default NewPlace
