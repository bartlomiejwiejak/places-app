import React from 'react'
import Card from './Card';
import Button from './Button';

function PlaceItem({ image, title, adress, description, id }) {
  return (
    <li className="place-item">
      <Card className='place-item__content'>
        <div className="place-item__image">
          <img src={image} alt={title} />
        </div>
        <div className="place-item__info">
          <h2>{title}</h2>
          <h3>{adress}</h3>
          <p>{description}</p>
        </div>
        <div className="place-item__actions">
          <Button inverse>VIEW ON MAP</Button>
          <Button to={`/places/${id}`}>EDIT</Button>
          <Button danger>DELETE</Button>
        </div>
      </Card>
    </li>
  )
}

export default PlaceItem
