import React from 'react'
import Card from './Card';
import PlaceItem from './PlaceItem';
import Button from './Button';

function PlaceList({ items }) {
  let content = null;
  if (items.length === 0) {
    content = (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to='/places/new'>Share Place</Button>
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
