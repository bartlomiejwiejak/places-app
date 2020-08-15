import React, { useState, useContext } from 'react'

import Card from '../../../shared/Card';
import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import Map from '../../../shared/Map';
import { AuthContext } from '../../../../context/auth-context';
import useHttp from '../../../../hooks/useHttp';
import ErrorModal from '../../../shared/ErrorModal';
import LoadingSpinner from '../../../shared/LoadingSpinner';

function PlaceItem({ image, title, address, description, id, coordinates, creatorId }) {

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoggedIn, userId, token } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(true)
  const { sendRequest, isLoading, error, clearError } = useHttp();


  const openMapHandler = () => {
    setShowMap(true)
  }

  const closeMapHandler = () => {
    setShowMap(false)
  }

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true)
  }

  const hideDeleteWarningHandler = () => {
    setShowConfirmModal(false)
  }

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await sendRequest(`http://localhost:5000/api/places/${id}`, 'DELETE', {}, {
        Authorization: 'Bearer ' + token
      });
      setIsMounted(false)
    } catch (err) { }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal onClear={clearError} error={error} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass='place-item__modal-content' footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal onCancel={hideDeleteWarningHandler} show={showConfirmModal} header='Are you sure?' footerClass='place-item__modal-actions' footer={
        <>
          <Button onClick={hideDeleteWarningHandler} inverse>CANCEL</Button>
          <Button onClick={confirmDeleteHandler} danger>DELETE</Button>
        </>
      }>
        <p>Do you want to preceed and delete this place? Please note it can't be undone.</p>
      </Modal>
      <li className="place-item">
        <Card className='place-item__content'>
          <div className="place-item__image">
            <img src={`${'http://localhost:5000/' + image}`} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {isLoggedIn && userId === creatorId && <Button to={`/places/${id}`}>EDIT</Button>}
            {isLoggedIn && userId === creatorId && <Button onClick={showDeleteWarningHandler} danger>DELETE</Button>}
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
