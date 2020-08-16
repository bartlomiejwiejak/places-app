import React, { useState, useContext, useRef, useCallback } from 'react'

import Card from '../../../shared/Card';
import Button from '../../../shared/Button';
import Modal from '../../../shared/Modal';
import Map from '../../../shared/Map';
import { AuthContext } from '../../../../context/auth-context';
import useHttp from '../../../../hooks/useHttp';
import ErrorModal from '../../../shared/ErrorModal';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import Comments from '../../../shared/Comments';
import gsap from 'gsap';

function PlaceItem({ image, title, address, description, id, coordinates, creatorId, likes, comments }) {

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoggedIn, userId, token } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(true)
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(!!likes.filter(like => like === userId).length)
  const [likesNumber, setLikesNumber] = useState(likes.length)
  const likeRef = useRef(null)
  const [commentNumber, setCommentNumber] = useState(comments);

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

  const commentNumberHandler = useCallback((number = commentNumber - 1) => {
    setCommentNumber(number)
  }, [commentNumber])

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await sendRequest(`http://192.168.8.132:5000/api/places/${id}`, 'DELETE', {}, {
        Authorization: 'Bearer ' + token
      });
      setIsMounted(false)
    } catch (err) { }
  }

  if (!isMounted) {
    return null;
  }

  const likePlaceHandler = async () => {
    if (isLiked) return;
    setIsLiked(true);
    try {
      await sendRequest(`http://192.168.8.132:5000/api/places/${id}/likes`, 'PATCH', {}, {
        Authorization: 'Bearer ' + token
      });
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      tl.to(likeRef.current, .5, { scale: 1 })
        .to(likeRef.current, .5, { scale: 0 })
      setLikesNumber(prev => prev + 1)
    } catch (err) {
      setIsLiked(false);
    }
  }

  const unlikePlaceHandler = async () => {
    if (!isLiked) return;
    setIsLiked(false);
    try {
      await sendRequest(`http://192.168.8.132:5000/api/places/${id}/likes`, 'PATCH', {}, {
        Authorization: 'Bearer ' + token
      });
      setLikesNumber(prev => prev - 1)
    } catch (err) {
      setIsLiked(true);
    }
  }

  let heart = <i style={token ? { cursor: 'pointer' } : {}} onClick={token ? likePlaceHandler : null} className="far fa-heart"></i>
  if (isLiked) {
    heart = <i style={token ? { cursor: 'pointer' } : {}} onClick={token ? unlikePlaceHandler : null} className="fas fa-heart"></i>
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
        <i ref={likeRef} className="far place-item__like fa-heart"></i>
        <Card className='place-item__content'>
          <div style={!isLiked && token ? { cursor: 'pointer' } : {}} onClick={token ? likePlaceHandler : null}>
            <div className="place-item__image">
              <img src={`${'http://192.168.8.132:5000/' + image}`} alt={title} />
            </div>
            <div className="place-item__info">
              <h2>{title}</h2>
              <h3>{address}</h3>
              <p>{description}</p>
            </div>
          </div>
          <div className="place-item__indicators">
            <div className="place-item__likes">{heart}<span className='place-item__likes-number'>{likesNumber}</span></div>
            <div className="place-item__comments"><span className='place-item__comments-number'>{commentNumber}</span><i className="far fa-comment"></i></div>
          </div>
          <div className="place-item__actions">
            <Button className='btn--small btn--green' onClick={openMapHandler}>MAP</Button>
            {isLoggedIn && userId === creatorId && <Button className='btn--small btn--green' to={`/places/${id}`}>EDIT</Button>}
            <Button onClick={toggleCommentsHandler} className='btn--small btn--blue'>COMMENTS</Button>
            {isLoggedIn && userId === creatorId && <Button className='btn--small btn--red' onClick={showDeleteWarningHandler}>DELETE</Button>}
          </div>
          {showComments && <Comments commentNumberHandler={commentNumberHandler} placeId={id} />}
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
