import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';

import useHttp from '../../../hooks/useHttp.js';
import ErrorModal from '../../shared/ErrorModal';
import Button from '../../shared/Button';
import { AuthContext } from '../../../context/auth-context';
import Modal from '../../shared/Modal';

function Profile({ id }) {
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { sendRequest, error, clearError } = useHttp();
  const { userId, token, logout } = useContext(AuthContext);
  const history = useHistory()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${id}`)
        setUserInfo(responseData)
      } catch (err) { }
    }
    fetchUserInfo()
  }, [sendRequest, id])

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
      <ErrorModal onClear={clearError} error={error} />
      {userInfo && <div className='user-profile'>
        <div className="user-profile__img">
          <img src={`http://192.168.8.132:5000/${userInfo.image}`} alt="User" />
        </div>
        <div className="user-profile__info">
          <div className="user-profile__line--1">
            <span className="user-profile__name">{userInfo.name}</span>
            {userId === id ? <div className="user-profile__action"><Button to={`/users/${id}`} className='btn--blue btn--small'>Edit Profile</Button><Button onClick={showDeleteWarningHandler} className='btn--red btn--small'>DELETE ACCOUNT</Button></div> : <div className="user-profile__action"><Button className='btn--blue btn--small'>Follow</Button></div>}
          </div>
          <div className="user-profile__line--2">
            <ul>
              <li><span>Places:</span><span>{userInfo.places.length}</span></li>
              <li><span>Followers:</span><span>{userInfo.followers.length}</span></li>
              <li><span>Follows:</span><span>{userInfo.following.length}</span></li>
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
