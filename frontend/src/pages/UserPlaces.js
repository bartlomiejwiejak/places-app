import React from 'react'
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

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

function UserPlaces() {

  const userId = useParams().userId

  const loadedPlaces = PLACES.filter(place => place.creator === userId)

  return <PlaceList items={loadedPlaces} />
}

export default UserPlaces
