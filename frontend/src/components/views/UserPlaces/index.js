import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import PlaceList from './PlaceList';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ErrorModal from '../../shared/ErrorModal';
import useHttp from '../../../hooks/useHttp';

function UserPlaces() {

  const [places, setPlaces] = useState(null)
  const { sendRequest, isLoading, error, clearError } = useHttp()
  const userId = useParams().userId

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
        setPlaces(responseData.places)
      } catch (err) { }
    }
    fetchPlaces()
  }, [sendRequest, userId])



  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {places && <PlaceList items={places} />}
    </>
  )
}

export default UserPlaces
