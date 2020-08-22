import React, { useEffect, useState, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom';

import useHttp from '../../../hooks/useHttp.js';
import ErrorModal from '../../shared/ErrorModal';
import Button from '../../shared/Button';
import { AuthContext } from '../../../context/auth-context';
import Modal from '../../shared/Modal';
import Avatar from '../../shared/Avatar';
import Users from '../Users';

function Profile({ id }) {
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersNumber, setFollowersNumber] = useState(0)
  const requestPendingRef = useRef(false);

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)

  const { sendRequest, error, clearError } = useHttp();
  const { userId, token, logout, updateFollow, following } = useContext(AuthContext);
  const history = useHistory()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${id}`)
        setUserInfo(responseData)
        setFollowersNumber(responseData.followers.length)
      } catch (err) { }
    }
    fetchUserInfo()
  }, [sendRequest, id, followersNumber])

  const hideDeleteWarningHandler = () => {
    setShowConfirmModal(false)
  }

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await sendRequest(`http://192.168.8.132:5000/api/users/${id}`, 'DELETE', {}, {
        Authorization: 'Bearer ' + token
      })
      logout();
      history.replace('/auth')
    } catch (err) { }
  }

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  }

  const handleFollow = async () => {
    if (requestPendingRef.current) return;
    try {
      requestPendingRef.current = true;
      await sendRequest(`http://192.168.8.132:5000/api/users/${id}/follow`, 'PATCH', {}, {
        Authorization: 'Bearer ' + token
      })
      if (isFollowing) {
        setIsFollowing(false)
        setFollowersNumber(prev => prev - 1)
        const newFollowing = following.filter(user => user !== id)
        requestPendingRef.current = false;
        updateFollow(newFollowing)
      } else {
        setIsFollowing(true)
        setFollowersNumber(prev => prev + 1)
        const newFollowing = [...following, id]
        requestPendingRef.current = false;
        updateFollow(newFollowing)
      }
    } catch (err) { }
  }

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${id}`)
        let isFollowing = false;
        isFollowing = !!responseData.followers.find(follower => follower === userId)
        setIsFollowing(isFollowing)
      } catch (err) { }
    }
    checkFollowing()
  }, [id, sendRequest, userId])

  const handleEdit = () => {
    history.push(`/users/${id}`)
  }

  const handleFollowModalClose = () => {
    setShowFollowModal(false)
  }
  const handleFollowersModalClose = () => {
    setShowFollowersModal(false)
  }

  const handleFollowModalOpen = () => {
    setShowFollowModal(true)
  }

  const handleFollowersModalOpen = () => {
    setShowFollowersModal(true)
  }

  return (
    <>
      <Modal onCancel={hideDeleteWarningHandler} show={showConfirmModal} header='Are you sure?' footerClass='place-item__modal-actions' footer={
        <>
          <Button className='btn--green' onClick={hideDeleteWarningHandler}>CANCEL</Button>
          <Button className='btn--red' onClick={confirmDeleteHandler}>DELETE</Button>
        </>
      }>
        <p>Do you want to preceed and delete your account? Please note it can't be undone.</p>
      </Modal>
      {userInfo && <Modal className='modal--follow' onCancel={handleFollowersModalClose} show={showFollowersModal} header={`Followers: ${followersNumber}`} footerClass='place-item__modal-actions' footer={
        <Button className='btn--red' onClick={handleFollowersModalClose}>CLOSE</Button>
      }>
        <Users cancelModal={handleFollowersModalClose} userList={userInfo.followers} />
      </Modal>}
      {userInfo && <Modal className='modal--follow' onCancel={handleFollowModalClose} show={showFollowModal} header={`Following: ${userInfo.following.length}`} footerClass='place-item__modal-actions' footer={
        <Button className='btn--red' onClick={handleFollowModalClose}>CLOSE</Button>
      }>
        <Users cancelModal={handleFollowModalClose} userList={userInfo.following} />
      </Modal>}
      <ErrorModal onClear={clearError} error={error} />
      {userInfo && <div className='user-profile'>
        <Avatar onClick={userId === id ? handleEdit : null} className='user-profile__img' style={userId === id ? { cursor: 'pointer' } : {}} image={`http://192.168.8.132:5000/${userInfo.image}`} alt='User' />
        <div className="user-profile__info">
          <div className="user-profile__line--1">
            <span className="user-profile__name">{userInfo.name}</span>
            {userId === id ? <div className="user-profile__action"><Button to={`/users/${id}`} className='btn--blue btn--small'>Edit Profile</Button><Button onClick={showDeleteWarningHandler} className='btn--red btn--small'>DELETE ACCOUNT</Button></div> : token && <div className="user-profile__action"> {isFollowing ? <Button onClick={handleFollow} className='btn--red btn--small'>Unfollow</Button> : <Button onClick={handleFollow} className='btn--blue btn--small'>Follow</Button>} </div>}
          </div>
          <div className="user-profile__line--2">
            <ul>
              <li><span>Places:</span><span>{userInfo.places.length}</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={handleFollowersModalOpen}>Followers:</span><span>{followersNumber}</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={handleFollowModalOpen}>Following:</span><span>{userInfo.following.length}</span></li>
            </ul>
          </div>
          <div className="user-profile__line--3">
            <p className="user-profile__description">{userInfo.description}</p>
          </div>
        </div>
      </div>}
    </>
  )
}

export default Profile