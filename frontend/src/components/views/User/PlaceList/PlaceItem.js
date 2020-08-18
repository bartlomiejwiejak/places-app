import React, { useState, useContext, useRef, useCallback, useEffect } from 'react'
import { formatRelative } from 'date-fns'

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

function PlaceItem({ image, title, address, description, id, coordinates, creatorId, likes, comments, date }) {

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
  const [authorInfo, setAuthorInfo] = useState(null)

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

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${creatorId}`);
        setAuthorInfo(responseData);
      } catch (err) { }
    }
    fetchAuthor()
  }, [creatorId, sendRequest])

  if (!isMounted) {
    return null;
  }

  const likePlaceHandler = async () => {
    const tl = gsap.timeline()
    tl.to(likeRef.current, .4, { scale: 1, ease: 'back.out(1.7)' })
      .to(likeRef.current, .4, { scale: 0, delay: .5, ease: 'power2.out' })
    if (isLiked) return;
    setIsLiked(true);
    try {
      await sendRequest(`http://192.168.8.132:5000/api/places/${id}/likes`, 'PATCH', {}, {
        Authorization: 'Bearer ' + token
      });
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

  let heart = <div onClick={token ? likePlaceHandler : null} style={token ? { cursor: 'pointer' } : {}} className="place-item__likes" >{<i className="far fa-heart"></i>}<span className='place-item__likes-number'>{likesNumber}</span></div>
  if (isLiked) {
    heart = <div onClick={token ? unlikePlaceHandler : null} style={token ? { cursor: 'pointer' } : {}} className="place-item__likes">{<i className="fas fa-heart"></i>}<span className='place-item__likes-number'>{likesNumber}</span></div>
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
      {authorInfo && <li className="place-item">
        <Card className='place-item__content'>
          <header className="place-item__author">
            <div className="place-item__author__img-container"><img alt='Place author' src={`http://192.168.8.132:5000/${authorInfo.image}`} className="place-item__author__img"></img></div>
            <div className="place-item__author__box">
              <span>{authorInfo.name}</span>
              <span>{date && formatRelative(new Date(date), new Date())}</span>
            </div>
          </header>
          <div style={token ? { cursor: 'pointer' } : {}} onClick={token ? likePlaceHandler : null}>
            <div className="place-item__image">
              <i ref={likeRef} className="fas fa-heart place-item__like"></i>
              <img src={`${'http://192.168.8.132:5000/' + image}`} alt={title} />
            </div>
            <div className="place-item__info">
              <h2>{title}</h2>
              <h3>{address}</h3>
              <p>{description}</p>
            </div>
          </div>
          <div className="place-item__indicators">
            {heart}
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
      </li>}
    </>
  )
}

export default PlaceItem
