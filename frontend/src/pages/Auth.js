import React, { useState, useContext } from 'react'

import Input from '../components/Input';
import useForm from '../hooks/useForm';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../functions/validators';
import Button from '../components/Button';
import Card from '../components/Card';
import { AuthContext } from '../context/auth-context';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import useHttp from '../hooks/useHttp';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, setUserId } = useContext(AuthContext);
  const { sendRequest, isLoading, error, clearError } = useHttp();

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

  const authSubmitHandler = async event => {
    event.preventDefault();
    if (isSignUp) {
      try {
        const response = await sendRequest('http://localhost:5000/api/users/signup', 'POST', JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }), {
          'Content-Type': 'application/json'
        });
        setUserId(response.user.id);
        login();
      } catch (err) { }
    } else {
      try {
        const response = await sendRequest('http://localhost:5000/api/users/login', 'POST', JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }), {
          'Content-Type': 'application/json'
        });
        setUserId(response.user.id);
        login();
      } catch (err) { }
    }
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
    <>
      <ErrorModal onClear={clearError} error={error} />
      <Card className='authentication'>
        {isLoading ? <LoadingSpinner asOverlay /> : null}
        <h2>{isSignUp ? 'Register' : 'Login'} required</h2>
        <form onSubmit={authSubmitHandler}>
          {isSignUp && <Input id='name' element='input' type='text' label='Your name' validators={[VALIDATOR_REQUIRE()]} onInput={inputChange} />}
          <Input id='email' element='input' type='email' label='E-mail' validators={[VALIDATOR_EMAIL()]} errorText='Please, enter a valid email.' onInput={inputChange} />
          <Input id='password' element='input' type='password' label='Password' validators={[VALIDATOR_MINLENGTH(6)]} errorText='Please, enter a valid password (at least 6 characters).' onInput={inputChange} />
          <Button submit disabled={!formState.isValid}>{isSignUp ? 'SIGNUP' : 'LOGIN'}</Button>
        </form>
        <Button onClick={switchIsSignUp} inverse>SWITCH TO{isSignUp ? ' SIGNIN' : ' SIGNUP'}</Button>
      </Card>
    </>
  )
}

export default Auth
