import React from 'react'

import Input from '../components/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../functions/validators';
import Button from '../components/Button';
import useForm from '../hooks/useForm';

function NewPlace() {

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
  const placeSubmitHandler = event => {
    event.preventDefault();
  }

  return <form className='place-form' onSubmit={placeSubmitHandler}>
    <Input onInput={inputChange} id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' />
    <Input onInput={inputChange} id='address' element='input' type='text' label='Adress' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid address.' />
    <Input onInput={inputChange} id='description' element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please, enter a valid description (at least 5 characters).' />
    <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
  </form>
}

export default NewPlace
