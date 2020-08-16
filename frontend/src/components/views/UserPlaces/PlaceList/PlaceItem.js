import React, { useState, useContext } from 'react'

import Card from '../../../shared/Card';
import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import Map from '../../../shared/Map';
import { AuthContext } from '../../../../context/auth-context';
import useHttp from '../../../../hooks/useHttp';
import ErrorModal from '../../../shared/ErrorModal';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import Comments from '../../../shared/Comments';

function PlaceItem({ image, title, address, description, id, coordinates, creatorId }) {

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoggedIn, userId, token } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(true)
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [showComments, setShowComments] = useState(false);

  const toggleCommentsHandler = () => {
    setShowComments(prevState => !prevState)
  }

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
        footer={<Button className='btn--red' onClick={closeMapHandler}>CLOSE</Button>}>
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal onCancel={hideDeleteWarningHandler} show={showConfirmModal} header='Are you sure?' footerClass='place-item__modal-actions' footer={
        <>
          <Button className='btn--green' onClick={hideDeleteWarningHandler}>CANCEL</Button>
          <Button className='btn--red' onClick={confirmDeleteHandler}>DELETE</Button>
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
            <Button className='btn--small btn--green' onClick={openMapHandler}>MAP</Button>
            {isLoggedIn && userId === creatorId && <Button className='btn--small btn--green' to={`/places/${id}`}>EDIT</Button>}
            <Button onClick={toggleCommentsHandler} className='btn--small btn--blue'>COMMENTS</Button>
            {isLoggedIn && userId === creatorId && <Button className='btn--small btn--red' onClick={showDeleteWarningHandler}>DELETE</Button>}
          </div>
          {showComments && <Comments placeId={id} />}
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
