import React, { useContext, useState } from 'react'

import { AuthContext } from '../../../context/auth-context';
import useHttp from '../../../hooks/useHttp';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ErrorModal from '../../shared/ErrorModal';

function Comment({ children, author, image, name, id, placeId, commentNumberHandler }) {

  const { userId, token } = useContext(AuthContext);
  const { error, isLoading, clearError, sendRequest } = useHttp();
  const [isMounted, setIsMounted] = useState(true);

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

  return (
    isMounted && <div className='comment'>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && <LoadingSpinner />}
      <div className="comment__img-container">
        <img src={`http://192.168.8.132:5000/${image}`} alt={author} className="comment__img" />
      </div>
      <div className="comment__content">
        <h1 className="comment__author">{name}</h1>
        <p className='comment__text'>{children}</p>
        {userId === author ? <div onClick={handleDelete} className="comment__delete">X</div> : null}
      </div>
    </div>
  )
}

export default Comment
