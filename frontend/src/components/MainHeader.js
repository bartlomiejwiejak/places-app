import React from 'react';
import { Link } from 'react-router-dom';

const MainHeader = () => {
  return (
    <header className='main-header'>
      <button className='main-navigation__menu-btn'>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h1 className="main-navigation__title">
        <Link to='/'>Your places</Link>
      </h1>
      <nav>
        ..
      </nav>
    </header>
  );
}

export default MainHeader;
