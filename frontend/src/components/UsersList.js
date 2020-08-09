import React from 'react';
import UserItem from './UserItem';

const UsersList = ({ items }) => {

  let content = <div className="center">
    <h2>No users found.</h2>
  </div>
  if (items.length > 0) {
    <ul>
      {items.map(item => (
        <UserItem
          key={item.id}
          id={item.id}
          image={item.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  }
  return content;
}

export default UsersList;
