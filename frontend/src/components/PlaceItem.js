import React, { useState } from 'react'

import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import Map from './Map';

function PlaceItem({ image, title, address, description, id, coordinates }) {

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const confirmDeleteHandler = () => {
    console.log('deleting')
    setShowConfirmModal(false)
  }

  return (
    <>
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
            <img src={image} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            <Button to={`/places/${id}`}>EDIT</Button>
            <Button onClick={showDeleteWarningHandler} danger>DELETE</Button>
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
