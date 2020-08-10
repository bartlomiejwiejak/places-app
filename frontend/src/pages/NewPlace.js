import React from 'react'

import Input from '../components/Input';

function NewPlace() {
  return <form className='place-form'>
    <Input element='input' type='text' label='title' />
  </form>
}

export default NewPlace
