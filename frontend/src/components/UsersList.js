import React from 'react';
import UserItem from './UserItem';

const UsersList = ({ items }) => {

  let content = <div className="center">
    <h2>No users found.</h2>
  </div>
  if (items.length > 0) {
    content = (
      <ul className='user-list'>
        {items.map(item => (
          <UserItem
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            placeCount={item.places}
          />
        ))}
      </ul>
    )
  }
  return content;
}

export default UsersList;
