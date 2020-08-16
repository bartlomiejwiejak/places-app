import React, { useEffect, useState, useRef } from 'react';

import UsersList from './UsersList';
import ErrorModal from '../../shared/ErrorModal';
import useHttp from '../../../hooks/useHttp';
import LoadingSpinner from '../../shared/LoadingSpinner';

const Users = () => {

  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [users, setUsers] = useState(null);
  const [value, setValue] = useState('');
  const fetchedUsersRef = useRef(null);

  const handleInputChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
  }

  useEffect(() => {
    if (!fetchedUsersRef.current) return;
    const filteredUsers = fetchedUsersRef.current.filter(user => user.name.toUpperCase().includes(value.toUpperCase()))
    setUsers(filteredUsers);
  }, [value])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');
        setUsers(responseData.users);
        fetchedUsersRef.current = responseData.users;
      } catch (err) { }
    }
    fetchUsers();
  }, [sendRequest])

  return <>
    <ErrorModal onClear={clearError} error={error} />
    {isLoading && <LoadingSpinner asOverlay />}
    <input placeholder='Search' onChange={handleInputChange} value={value} className='users-search' />
    {!isLoading && users ? <UsersList items={users} /> : null}
  </>
}

export default Users;