import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom';

import Input from '../shared/Input';
import Button from '../shared/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../functions/validators';
import useForm from '../../hooks/useForm';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorModal from '../shared/ErrorModal';
import useHttp from '../../hooks/useHttp';
import { AuthContext } from '../../context/auth-context';

function UpdatePlace() {

  const placeId = useParams().placeId
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [loadedPlace, setLoadedPlace] = useState(null)
  const history = useHistory()
  const { userId, token } = useContext(AuthContext);

  const [formState, inputChange, setFormData] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
  }, false)

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/places/${placeId}`)
        const identifiedPlace = responseData.place;
        setLoadedPlace(identifiedPlace);
        setFormData({
          title: {
            value: identifiedPlace.title,
            isValid: true
          },
          description: {
            value: identifiedPlace.description,
            isValid: true
          },
        }, true)
      } catch (err) { }
    }
    fetchPlace();
  }, [placeId, sendRequest, setFormData])

  if (isLoading) {
    return (
      <LoadingSpinner asOverlay />
    )
  }

  if (!loadedPlace && !error) {
    return <LoadingSpinner asOverlay />
  }

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    const updatePlace = async () => {
      try {
        await sendRequest(`http://192.168.8.132:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }), {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        })
        history.push('/' + userId + '/places');
      } catch (err) { }
    }
    updatePlace();
  }

  return (
    <>
      <ErrorModal onClear={clearError} error={error} />
      {!isLoading && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <h1>Update Your Place</h1>
        <Input id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' initialValue={loadedPlace.title} valid={true} onInput={inputChange} />
        <Input id='description' element='textarea' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please, enter a valid description (at least 5 characters).' initialValue={loadedPlace.description} valid={true} onInput={inputChange} />
        <Button type='submit' className='btn--green btn--small' disabled={!formState.isValid}>UPDATE PLACE</Button>
      </form>}
    </>
  )
}

export default UpdatePlace
