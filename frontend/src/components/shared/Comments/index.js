import React, { useEffect, useState, useContext } from 'react'

import Comment from './Comment';
import useHttp from '../../../hooks/useHttp';
import { AuthContext } from '../../../context/auth-context';
import ErrorModal from '../../shared/ErrorModal';
import LoadingSpinner from '../LoadingSpinner';

function Comments({ placeId, commentNumberHandler }) {
  const { error, clearError, sendRequest, isLoading } = useHttp();
  const [value, setValue] = useState('');
  const { token, userImage } = useContext(AuthContext);
  const [comments, setComments] = useState(null);
  const [commentsAdded, setCommentsAdded] = useState(0)

  const inputHandler = (event) => {
    setValue(event.target.value)
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`http://192.168.8.132:5000/api/places/${placeId}/comments`, 'PATCH', JSON.stringify({
        content: value
      }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        })
      setValue('');
      setCommentsAdded(prevState => prevState + 1)
    } catch (err) { }
  }

  useEffect(() => {
    let responseBody;
    const fetchComments = async () => {
      try {
        responseBody = await sendRequest(`http://192.168.8.132:5000/api/places/${placeId}/comments`);
        setComments(responseBody.comments)
        commentNumberHandler(responseBody.comments.length)
      } catch (err) { }
    }
    fetchComments()
  }, [commentsAdded, placeId, sendRequest, commentNumberHandler])

  return (
    <div className='comment-container'>
      <ErrorModal onClear={clearError} error={error} />
      {token && <form className='comment__form' onSubmit={submitHandler}>
        <div className="comment__img-container">
          <img src={`http://192.168.8.132:5000/${userImage}`} alt='Your img' className="comment__img" />
        </div>
        <input value={value} onChange={inputHandler} placeholder='Add comment...' className="comment__add" />
        {isLoading && <LoadingSpinner />}
      </form>}
      {comments && comments.map(comment => <Comment likes={comment.likes} commentNumberHandler={commentNumberHandler} placeId={placeId} key={comment.id} id={comment.id} author={comment.author} name={comment.name} image={comment.image}>{comment.content}</Comment>)}
    </div>
  )
}

export default Comments;