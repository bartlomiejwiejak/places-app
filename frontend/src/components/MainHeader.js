import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import Sidedrawer from './Sidedrawer';

const MainHeader = () => {
  return (
    <header className='main-header'>
      <Sidedrawer>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </Sidedrawer>
      <button className='main-navigation__menu-btn'>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <h1 className='main-navigation__title'>
        <Link to='/'>Your places</Link>
      </h1>
      <nav className='main-navigation__header-nav'>
        <NavLinks />
      </nav>
    </header>
  );
}

export default MainHeader;
