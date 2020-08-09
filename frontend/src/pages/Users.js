import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [{
    id: 1,
    name: 'Bartek',
    image: 'https://picsum.photos/200/300',
    places: 3
  }];

  return <UsersList items={USERS} />
}

export default Users;
