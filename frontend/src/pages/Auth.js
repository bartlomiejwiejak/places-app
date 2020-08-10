import React, { useState, useContext } from 'react'

import Input from '../components/Input';
import useForm from '../hooks/useForm';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../functions/validators';
import Button from '../components/Button';
import Card from '../components/Card';
import { AuthContext } from '../context/auth-context';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useContext(AuthContext);

  const [formState, inputChange, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false)

  const authSubmitHandler = event => {
    event.preventDefault();
    login();
  }

  const switchIsSignUp = () => {
    if (!isSignUp) {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false)
    } else {
      setFormData({
        ...formState.inputs,
        name: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    }
    setIsSignUp((prev) => !prev)
  }

  return (
    <Card className='authentication'>
      <h2>{isSignUp ? 'Register' : 'Login'} required</h2>
      <form onSubmit={authSubmitHandler}>
        {isSignUp && <Input id='name' element='input' type='text' label='Your name' validators={[VALIDATOR_REQUIRE()]} onInput={inputChange} />}
        <Input id='email' element='input' type='email' label='E-mail' validators={[VALIDATOR_EMAIL()]} errorText='Please, enter a valid email.' onInput={inputChange} />
        <Input id='password' element='input' type='password' label='Password' validators={[VALIDATOR_MINLENGTH(6)]} errorText='Please, enter a valid password (at least 5 characters).' onInput={inputChange} />
        <Button submit disabled={!formState.isValid}>LOGIN</Button>
      </form>
      <Button onClick={switchIsSignUp} inverse>SWITCH TO{isSignUp ? ' SIGNIN' : ' SIGNUP'}</Button>
    </Card>
  )
}

export default Auth
