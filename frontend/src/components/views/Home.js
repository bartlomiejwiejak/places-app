import React, { useEffect, useState, useContext } from 'react'

import Placelist from './User/PlaceList';
import useHttp from '../../hooks/useHttp';
import ErrorModal from '../shared/ErrorModal';
import LoadingSpinner from '../shared/LoadingSpinner';
import { AuthContext } from '../../context/auth-context';

function Home() {

  const [places, setPlaces] = useState(null)
  const { error, isLoading, clearError, sendRequest } = useHttp()
  const { following, userId } = useContext(AuthContext)

  useEffect(() => {
    const fetchPlaces = async () => {
      let places = []
      try {
        const responseData = await sendRequest('http://192.168.8.132:5000/api/places/users', 'POST', JSON.stringify({
          users: following
        }), {
          'Content-Type': 'application/json'
        })
        places = [...places, ...responseData.places]
      } catch (err) { }
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/places/user/${userId}`);
        places = [...places, ...responseData.places]
        setPlaces(places);
      } catch (err) { }
    }
    fetchPlaces();
  }, [following, sendRequest, userId])

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal onClear={clearError} error={error} />
      {places && <Placelist home={true} items={places} />}
    </>
  )
}

export default Home