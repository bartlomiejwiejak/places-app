import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import Input from '../components/Input';
import Button from '../components/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../functions/validators';
import useForm from '../hooks/useForm';
import Card from '../components/Card';

const PLACES = [
  {
    id: 'p1',
    title: 'Warsaw',
    description: 'Best city in eu',
    imageUrl: 'https://s27363.pcdn.co/wp-content/uploads/2020/05/Things-to-do-in-Warsaw.jpg.optimal.jpg',
    address: 'Sienna 39, 00-121 Warszawa',
    location: {
      lat: 52.2318392,
      lng: 20.9998857
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Krakow',
    description: 'Worst',
    imageUrl: 'https://s27363.pcdn.co/wp-content/uploads/2020/05/Things-to-do-in-Warsaw.jpg.optimal.jpg',
    address: 'Sienna 39, 00-121 Warszawa',
    location: {
      lat: 52.2318392,
      lng: 20.9998857
    },
    creator: 'u2'
  }
]

function UpdatePlace() {

  const placeId = useParams().placeId
  const [isLoading, setIsLoading] = useState(true);

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

  const identifiedPlace = PLACES.find(place => place.id === placeId)
  useEffect(() => {
    if (identifiedPlace) {
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
    }
    setIsLoading(false)
  }, [setFormData, identifiedPlace])

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
  }

  if (isLoading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' initialValue={formState.inputs.title.value} valid={formState.inputs.title.isValid} onInput={inputChange} />
      <Input id='title' element='textarea' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please, enter a valid description (at least 5 characters).' initialValue={formState.inputs.description.value} valid={formState.inputs.description.isValid} onInput={inputChange} />
      <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>
  )
}

export default UpdatePlace
