import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../../context/auth-context';
import useHttp from '../../../hooks/useHttp';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ErrorModal from '../../shared/ErrorModal';

function Comment({ children, author, image, name, id, placeId, commentNumberHandler }) {

  const [isMounted, setIsMounted] = useState(true);
  const [authorData, setAuthorData] = useState(null)

  const { userId, token } = useContext(AuthContext);
  const { error, isLoading, clearError, sendRequest } = useHttp();
  const history = useHistory()

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const responseData = await sendRequest(`http://192.168.8.132:5000/api/users/${author}`)
        setAuthorData({ image: responseData.image, name: responseData.name })
      } catch (err) { }
    }
    fetchAuthor()
  }, [author, sendRequest])

  const handleDelete = () => {
    const deleteComment = async () => {
      try {
        await sendRequest(`http://192.168.8.132:5000/api/places/${placeId}/comments/${id}`, 'DELETE', null,
          {
            Authorization: 'Bearer ' + token
          }
        )
        commentNumberHandler()
        setIsMounted(false)
      } catch (err) { }
    }
    deleteComment();
  }

  const handleRedirect = () => {
    history.push(`/${author}/places`)
  }

  return (
    isMounted && authorData && <div className='comment'>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && <LoadingSpinner />}
      <div style={{ cursor: 'pointer' }} onClick={handleRedirect} className="comment__img-container">
        <img src={`http://192.168.8.132:5000/${authorData.image}`} alt={author} className="comment__img" />
      </div>
      <div className="comment__content">
        <h1 className="comment__author">{authorData.name}</h1>
        <p className='comment__text'>{children}</p>
        {userId === author ? <div onClick={handleDelete} className="comment__delete">x</div> : null}
      </div>
    </div>
  )
}

export default Comment
