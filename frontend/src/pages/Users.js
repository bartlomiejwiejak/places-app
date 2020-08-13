import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../components/ErrorModal';

const Users = () => {

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (response.ok) {
          const responseData = await response.json();
          setUsers(responseData.users);
          setIsLoading(false);
        } else {
          throw new Error(response.error.message);
        }
      } catch (err) {
        setError(err);
        setIsLoading(false)
      }
    }
    fetchUsers();
  }, [])

  const errorHandler = () => {
    setError(null)
  }

  return <>
    <ErrorModal onClear={errorHandler} error={error} />
    {isLoading && users ? <UsersList items={users} /> : null}
  </>
}

export default Users;
