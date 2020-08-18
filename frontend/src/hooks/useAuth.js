import { useState, useEffect, useCallback } from 'react';

let logoutTimeout;

export default () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userImage, setUserImage] = useState(null)
  const [userName, setUserName] = useState(null)

  const logout = useCallback(() => {
    setUserId(null)
    setToken(null)
    localStorage.removeItem('userData')
    if (logoutTimeout) {
      clearTimeout(logoutTimeout)
    }
  }, [])

  const login = useCallback((userId, token, expirationDate, userImage, name) => {
    setUserId(userId)
    setUserImage(userImage)
    setToken(token)
    setUserName(name)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    localStorage.setItem('userData', JSON.stringify({ userId, token, expiration: tokenExpirationDate.toISOString(), userImage: userImage, userName: name }))
    logoutTimeout = setTimeout(() => {
      logout();
    }, tokenExpirationDate.getTime() - new Date().getTime())
  }, [logout])

  const updateUser = useCallback((name, userImage) => {
    setUserName(name);
    setUserImage(userImage);
    const storedData = JSON.parse(localStorage.getItem('userData'))
    localStorage.setItem('userData', JSON.stringify({ userId: storedData.userId, token: storedData.token, expiration: storedData.expiration.toISOString(), userImage: userImage, userName: name }))
  }, [])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration), storedData.userImage, storedData.userName)
    }
  }, [login])

  return { login, logout, userId, token, userImage, userName, updateUser }
}