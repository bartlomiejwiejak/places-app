import React, { useState, useContext } from 'react'

import Input from '../shared/Input';
import useForm from '../../hooks/useForm';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../functions/validators';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { AuthContext } from '../../context/auth-context';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorModal from '../shared/ErrorModal';
import useHttp from '../../hooks/useHttp';
import ImageUpload from '../shared/ImageUpload';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useContext(AuthContext);
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
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value)
        formData.append('name', formState.inputs.name.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)
        const response = await sendRequest('http://localhost:5000/api/users/signup', 'POST', formData);
        login(response.user, response.token);
      } catch (err) { }
    } else {
      try {
        const response = await sendRequest('http://localhost:5000/api/users/login', 'POST', JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }), {
          'Content-Type': 'application/json'
        });
        login(response.user, response.token);
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
        },
        image: {
          value: '',
          isValid: false
        }
      }, false)
    } else {
      setFormData({
        ...formState.inputs,
        name: undefined,
        image: undefined
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
          {isSignUp && <Input id='name' element='input' errorText='Please, enter name.' type='text' label='Your name' validators={[VALIDATOR_REQUIRE()]} onInput={inputChange} />}
          {isSignUp && <ImageUpload errorText='Please, provide an image.' onInput={inputChange} center id='image' />}
          <Input id='email' element='input' type='email' label='E-mail' validators={[VALIDATOR_EMAIL()]} errorText='Please, enter a valid email.' onInput={inputChange} />
          <Input id='password' element='input' type='password' label='Password' validators={[VALIDATOR_MINLENGTH(6)]} errorText='Please, enter a valid password (at least 6 characters).' onInput={inputChange} />
          <Button className='btn--small btn--green' type='submit' disabled={!formState.isValid}>{isSignUp ? 'SIGN UP' : 'LOGIN'}</Button>
        </form>
        <Button className='btn--small btn--blue' onClick={switchIsSignUp}>SWITCH TO{isSignUp ? ' SIGN IN' : ' SIGN UP'}</Button>
      </Card>
    </>
  )
}

export default Auth
