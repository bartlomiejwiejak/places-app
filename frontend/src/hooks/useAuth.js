import { useState, useEffect, useCallback } from 'react';

let logoutTimeout;

export default () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const logout = useCallback(() => {
    setUserId(null)
    setToken(null)
    localStorage.removeItem('userData')
    if (logoutTimeout) {
      clearTimeout(logoutTimeout)
    }
  }, [])

  const login = useCallback((userId, token, expirationDate) => {
    setUserId(userId)
    setToken(token)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    localStorage.setItem('userData', JSON.stringify({ userId, token, expiration: tokenExpirationDate.toISOString() }))
    logoutTimeout = setTimeout(() => {
      logout();
    }, tokenExpirationDate.getTime() - new Date().getTime())
  }, [logout])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])
  return { login, logout, userId, token }
}