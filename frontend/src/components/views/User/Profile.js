import React, { useEffect, useState, useContext } from 'react'

import useHttp from '../../../hooks/useHttp.js';
import ErrorModal from '../../shared/ErrorModal';
import Button from '../../shared/Button';
import { AuthContext } from '../../../context/auth-context';

function Profile({ id }) {
  const [userInfo, setUserInfo] = useState(null);

  const { sendRequest, error, clearError } = useHttp();
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${id}`)
        setUserInfo(responseData)
      } catch (err) { }
    }
    fetchUserInfo()
  }, [sendRequest, id])

  return (
    <>
      <ErrorModal onClear={clearError} error={error} />
      {userInfo && <div className='user-profile'>
        <div className="user-profile__img">
          <img src={`http://192.168.8.132:5000/${userInfo.image}`} alt="User" />
        </div>
        <div className="user-profile__info">
          <div className="user-profile__line--1">
            <span className="user-profile__name">{userInfo.name}</span>
            {userId === id ? <div className="user-profile__action"><Button to={`/users/${id}`} className='btn--blue btn--small'>Edit Profile</Button></div> : <div className="user-profile__action"><Button className='btn--blue btn--small'>Follow</Button></div>}
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
