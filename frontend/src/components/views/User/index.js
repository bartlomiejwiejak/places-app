import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import PlaceList from './PlaceList';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ErrorModal from '../../shared/ErrorModal';
import useHttp from '../../../hooks/useHttp';
import Profile from './Profile';

function UserPlaces() {

  const [places, setPlaces] = useState(null)
  const { sendRequest, isLoading, error, clearError } = useHttp()
  const userId = useParams().userId

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/places/user/${userId}`)
        setPlaces(responseData.places)
      } catch (err) { }
    }
    fetchPlaces()
  }, [sendRequest, userId])

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Profile id={userId} />
      {places && <PlaceList id={userId} items={places} />}
    </>
  )
}

export default UserPlaces
