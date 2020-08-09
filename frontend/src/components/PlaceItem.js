import React from 'react'
import Card from './Card';

function PlaceItem({ image, title, adress, description }) {
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
          <button>VIEW ON MAP</button>
          <button>EDIT</button>
          <button>DELETE</button>
        </div>
      </Card>
    </li>
  )
}

export default PlaceItem
