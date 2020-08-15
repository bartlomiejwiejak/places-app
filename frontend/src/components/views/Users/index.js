import React, { useEffect, useState } from 'react';

import UsersList from './UsersList';
import ErrorModal from '../../shared/ErrorModal';
import useHttp from '../../../hooks/useHttp';
import LoadingSpinner from '../../shared/LoadingSpinner';

const Users = () => {

  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');
        setUsers(responseData.users);
      } catch (err) { }
    }
    fetchUsers();
  }, [sendRequest])

  return <>
    <ErrorModal onClear={clearError} error={error} />
    {isLoading && <LoadingSpinner asOverlay />}
    {!isLoading && users ? <UsersList items={users} /> : null}
  </>
}

export default Users;