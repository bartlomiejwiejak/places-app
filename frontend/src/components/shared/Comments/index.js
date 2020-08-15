import React, { useEffect } from 'react'

import Comment from './Comment';
import useHttp from '../../../hooks/useHttp';

function Comments() {
  const { isLoading, error, clearError, sendRequest } = useHttp();

  return (
    <div className='comment-container'>
      <Comment author='Bartek' image='https://www.oneworldplayproject.com/wp-content/uploads/2016/03/avatar-1024x1024.jpg'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod hic non fugit deserunt soluta. Temporibus praesentium fugiat odio quia cumque, debitis veritatis ipsa voluptates vel nulla nostrum aspernatur, aliquam vitae.</Comment>
      <Comment author='Bartek' image='https://www.oneworldplayproject.com/wp-content/uploads/2016/03/avatar-1024x1024.jpg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, reprehenderit soluta sed reiciendis voluptatum eaque eius deleniti quo voluptas neque eligendi, culpa quibusdam aperiam veniam. Est, magni delectus. Rerum, sapiente.Dolor architecto iste incidunt saepe reprehenderit mollitia laborum, molestiae suscipit nemo atque at ipsum voluptate quos accusamus veniam facere eius iusto cum minus numquam? Ullam dicta veniam obcaecati reprehenderit tempore.</Comment>
    </div>
  )
}

export default Comments
