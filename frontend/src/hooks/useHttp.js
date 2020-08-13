import { useState, useCallback, useEffect, useRef } from 'react'

function useHttp() {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsloading(true);
    const abortController = new AbortController()
    activeHttpRequests.current.push(abortController);
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: abortController.signal
      })
      const responseData = await response.json();

      if (response.ok) {
        activeHttpRequests.current = activeHttpRequests.current.filter(request => request !== abortController)
        setIsloading(false)
        return responseData;
      } else {
        throw new Error(responseData.message)
      }
    }
    catch (err) {
      setError(err.message)
      setIsloading(false)
      throw err;
    }
  }, [])

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(request => {
        if (request.abortCtrl !== undefined) {
          request.abortCtrl.abort()
        }
      })
    }
  }, [])

  return { sendRequest, isLoading, error, clearError }
}

export default useHttp;
