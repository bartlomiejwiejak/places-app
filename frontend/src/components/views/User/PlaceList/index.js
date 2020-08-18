import React, { useContext } from 'react'

import Card from '../../../shared/Card';
import PlaceItem from './PlaceItem';
import { AuthContext } from '../../../../context/auth-context';
import Button from '../../../shared/Button';

function PlaceList({ items, id }) {
  const { userId } = useContext(AuthContext)

  let content = null;
  if (items.length === 0) {
    content = (
      <div style={{ textAlign: 'center' }} className="place-list">
        {userId === id ? <Button to='/places/new' className='btn--green'>CREATE PLACE</Button> : <Card style={{ padding: '2rem', width: '100%' }}>
          User has no places.
        </Card>}
      </div>
    )
  } else {
    content = (
      <ul className="place-list">
        {items.map((item => (
          <PlaceItem
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            address={item.address}
            creatorId={item.creator}
            coordinates={item.location}
            likes={item.likes}
            comments={item.comments.length}
          />
        )))}
      </ul>
    )
  }

  return content;
}

export default PlaceList
