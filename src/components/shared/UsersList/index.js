import React from 'react';

import UserItem from './UserItem';
import Card from '../Card';

const UsersList = ({ items }) => {


  let content = <Card style={{ borderRadius: '6px', padding: '2rem', margin: '2rem 0', width: '100%' }} className='user-item__content'>No users found.</Card>


  if (items.length > 0) {
    content = (
      <ul className='users-list'>
        {items.map(item => (
          <UserItem
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            placeCount={item.places.length}
          />
        ))}
      </ul>
    )
  }
  return content;
}

export default UsersList;
