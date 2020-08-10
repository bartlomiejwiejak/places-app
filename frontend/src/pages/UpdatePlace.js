import React from 'react'
import { useParams } from 'react-router-dom';

import Input from '../components/Input';
import Button from '../components/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../functions/validators';

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
    title: 'Warsaw',
    description: 'Best city in eu',
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

  const identifiedPlace = PLACES.find(place => place.id === placeId)

  if (!identifiedPlace) {
    return <div>
      <h2>Could not find place!</h2>
    </div>
  }

  return (
    <form action="">
      <Input id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please, enter a valid title.' value={identifiedPlace.title} valid={true} />
      <Input id='title' element='textarea' label='Description' validators={[VALIDATOR_MINLENGTH()]} errorText='Please, enter a valid description.' value={identifiedPlace.description} valid={true} />
      <Button type='submit' disabled={true}>UPDATE PLACE</Button>
    </form>
  )
}

export default UpdatePlace
