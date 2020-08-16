import React, { useContext } from 'react'

import Button from '../../shared/Button';
import '../../../context/auth-context';
import { AuthContext } from '../../../context/auth-context';

function Home() {

  const { token } = useContext(AuthContext)

  return (
    <div className='home'>
      <div className="home__heading">
        <h1 className='heading-primary mb-s'>PLACES APP</h1>
        <h2 className='heading-secondary mb-l'>ONE PLACE TO SHARE ALL YOUR MEMORIES</h2>
        <Button to='/users' className='btn--white btn--animated'>EXPLORE OUR USERS</Button>
        {!token && <Button className='btn--white btn--animated' to='/auth'>JOIN OUR COMMUNITY</Button>}
      </div>
    </div>
  )
}

export default Home;
