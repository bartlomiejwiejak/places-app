import { useState, useEffect, useCallback } from 'react';

let logoutTimeout;

export default () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userImage, setUserImage] = useState(null)
  const [userName, setUserName] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const logout = useCallback(() => {
    setUserId(null)
    setToken(null)
    setFollowers([])
    setFollowing([])
    setUserImage(null)
    setUserName(null)

    localStorage.removeItem('userData')
    if (logoutTimeout) {
      clearTimeout(logoutTimeout)
    }
  }, [])

  const login = useCallback((userId, token, expirationDate, userImage, name, followers, following) => {
    setUserId(userId)
    setUserImage(userImage)
    setToken(token)
    setUserName(name)
    setFollowing(following)
    setFollowers(followers)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    localStorage.setItem('userData', JSON.stringify({ userId, token, expiration: tokenExpirationDate.toISOString(), userImage: userImage, userName: name, following, followers }))
    logoutTimeout = setTimeout(() => {
      logout();
    }, tokenExpirationDate.getTime() - new Date().getTime())
  }, [logout])

  const updateUser = useCallback((name, userImage) => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    localStorage.setItem('userData', JSON.stringify({ userId: storedData.userId, token: storedData.token, expiration: storedData.expiration, userImage: userImage, userName: name, following: storedData.following, followers: storedData.followers }))
    setUserName(name);
    setUserImage(userImage);
  }, [])

  const updateFollow = useCallback((following, followers) => {
    if (followers) {
      setFollowers(followers)
    };
    if (following) {
      setFollowing(following);
    }
    const storedData = JSON.parse(localStorage.getItem('userData'))
    localStorage.setItem('userData', JSON.stringify({ userId: storedData.userId, token: storedData.token, expiration: storedData.expiration, userImage: storedData.userImage, userName: storedData.name, following: following ? following : storedData.following, followers: followers ? followers : storedData.followers }))
  }, [])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration), storedData.userImage, storedData.userName, storedData.followers, storedData.following)
    }
  }, [login])

  return { login, logout, userId, token, userImage, userName, updateUser, following, followers, updateFollow }
}