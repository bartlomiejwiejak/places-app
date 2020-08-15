import React from 'react';

import UserItem from './UserItem';
import Card from '../../../shared/Card';

const UsersList = ({ items }) => {

  let content = <div className="center">
    <Card>
      <h2>No users found.</h2>
    </Card>
  </div>
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
