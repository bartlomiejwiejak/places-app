import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/Input';
import useForm from '../../../hooks/useForm';
import ImageUpload from '../../shared/ImageUpload';
import Button from '../../shared/Button';
import { VALIDATOR_MAXLENGTH, VALIDATOR_REQUIRE } from '../../../functions/validators';
import Card from '../../shared/Card';
import useHttp from '../../../hooks/useHttp';
import ErrorModal from '../../shared/ErrorModal';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { AuthContext } from '../../../context/auth-context';

function UpdateUser() {

  const { isLoading, error, clearError, sendRequest } = useHttp();
  const { id } = useParams();
  const [loadedUser, setLoadedUser] = useState(null)
  const { token, updateUser } = useContext(AuthContext)
  const history = useHistory();

  const [formState, inputChange, setFormData] = useForm({
    name: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false,
    },
    image: {
      value: '',
      isValid: false
    }
  }, true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${id}`);
        setLoadedUser(responseData)
        setFormData({
          name: {
            value: responseData.name,
            isValid: true
          },
          description: {
            value: responseData.description,
            isValid: true
          },
          image: {
            value: '',
            isValid: true
          }
        }, true)
      } catch (err) { }
    }
    fetchData()
  }, [id, sendRequest, setFormData])

  const updateUserHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', formState.inputs.name.value)
    formData.append('description', formState.inputs.description.value)
    formData.append('image', formState.inputs.image.value)
    try {
      const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${id}`, 'PATCH', formData, {
        Authorization: 'Bearer ' + token
      })
      await updateUser(formState.inputs.name.value, responseData.user.image);
      history.push(`/${id}/places`)
    } catch (err) { }
  }

  return (
    <>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedUser && !isLoading && <Card className='user-update'>
        <h1>Update Your Profile</h1>
        <form onSubmit={updateUserHandler}>
          <Input valid={true} initialValue={loadedUser.name} id='name' element='input' errorText='Please, enter name (max 16 characters).' type='text' label='Your name' validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(16)]} onInput={inputChange} />
          <ImageUpload valid={true} initialValue={loadedUser.image} errorText='Please, provide an image.' onInput={inputChange} center id='image' />
          <Input valid={true} initialValue={loadedUser.description} id='description' element='textarea' type='text' label='Description' onInput={inputChange} validators={[]} />
          <Button className='btn--small btn--green' type='submit' disabled={!formState.isValid}>UPDATE</Button>
        </form>
      </Card>}
    </>
  )
}

export default UpdateUser;
