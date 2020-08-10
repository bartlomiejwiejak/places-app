import React from 'react'

import Input from '../components/Input';
import { VALIDATOR_REQUIRE } from '../functions/validators';

function NewPlace() {
  return <form className='place-form'>
    <Input element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' />
  </form>
}

export default NewPlace
