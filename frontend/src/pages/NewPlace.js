import React, { useCallback, useReducer } from 'react'

import Input from '../components/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../functions/validators';
import Button from '../components/Button';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        }
        else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid
          }
        },
        isValid: formIsValid
      }
    default: return state;
  }
}

function NewPlace() {

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    isValid: false
  })
  const inputChange = useCallback((inputId, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', isValid: isValid, value: value, inputId: inputId })
  }, [])

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs)
  }

  return <form className='place-form' onSubmit={placeSubmitHandler}>
    <Input onInput={inputChange} id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' />
    <Input onInput={inputChange} id='adress' element='input' type='text' label='Adress' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid address.' />
    <Input onInput={inputChange} id='description' element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please, enter a valid description (at least 5 characters).' />
    <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
  </form>
}

export default NewPlace
