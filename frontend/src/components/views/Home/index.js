import React from 'react'

import Button from '../../shared/Button';

function Home() {
  return (
    <div className='home'>
      <div className="home__heading">
        <h1 className='heading-primary mb-s'>PLACES APP</h1>
        <h2 className='heading-secondary mb-l'>ONE PLACE TO SHARE ALL YOUR MEMORIES</h2>
        <Button to='/users' className='btn--white btn--animated'>EXPLORE OUR USERS</Button>
      </div>
    </div>
  )
}

export default Home;
