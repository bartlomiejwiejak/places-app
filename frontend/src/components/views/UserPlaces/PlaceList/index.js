import React from 'react'

import Card from '../../../shared/Card';
import PlaceItem from './PlaceItem';

function PlaceList({ items }) {
  let content = null;
  if (items.length === 0) {
    content = (
      <div className="place-list center">
        <Card>
          <h2 style={{ padding: '2rem', fontSize: '2rem' }}>No places found.</h2>
        </Card>
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
          />
        )))}
      </ul>
    )
  }

  return content;
}

export default PlaceList
