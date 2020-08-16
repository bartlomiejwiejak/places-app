import React from 'react'

function Comment({ children, author, image }) {
  return (
    <div className='comment'>
      <div className="comment__img-container">
        <img src={`http://localhost:5000/${image}`} alt={author} className="comment__img" />
      </div>
      <div className="comment__content">
        <h1 className="comment__author">{author}</h1>
        <p className='comment__text'>{children}</p>
      </div>
    </div>
  )
}

export default Comment
