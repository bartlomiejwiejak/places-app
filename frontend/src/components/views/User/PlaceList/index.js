import React, { useContext } from 'react'

import Card from '../../../shared/Card';
import PlaceItem from './PlaceItem';
import { AuthContext } from '../../../../context/auth-context';
import Button from '../../../shared/Button';

function PlaceList({ items, id }) {
  const { userId } = useContext(AuthContext)

  let content = null;
  if (items.length === 0 && userId !== id) {
    content = (
      <div style={{ textAlign: 'center' }} className="place-list">
        <Card style={{ padding: '2rem', width: '100%' }}>
          User has no places.
        </Card>
      </div>
    )
  } else {
    function compare(a, b) {
      if (!a.date || !b.date) {
        return;
      }
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      let comparison = 0;
      if (dateA > dateB) {
        comparison = -1;
      } else if (dateA < dateB) {
        comparison = 1;
      }
      return comparison;
    }

    items.sort(compare);
    content = (
      <ul className="place-list">
        {userId === id && <div style={{ textAlign: 'center', marginBottom: '3rem' }}><Button className='btn--green' to={'/places/new'}>Create Place</Button></div>}
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
            date={item.date}
          />
        )))}
      </ul>
    )
  }

  return content;
}

export default PlaceList
