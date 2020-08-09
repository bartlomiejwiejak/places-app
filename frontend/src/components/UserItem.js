import React from 'react';
import Avatar from './Avatar';
import Card from './Card';
import { Link } from 'react-router-dom';

const UserItem = ({ image, name, placeCount, id }) => {
  return (
    <li className='user-item'>
      <Card className='user-item__content'>
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>{placeCount} {placeCount === '1' ? 'Place' : 'Places'}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
}

export default UserItem;
