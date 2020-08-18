import React from 'react';
import { NavLink } from 'react-router-dom';

import NavLinks from './NavLinks';

const MainHeader = () => {

  return (
    <header className='main-header'>
      <div className="main-header__content">
        <h1 className='main-navigation__title'>
          <NavLink exact to='/'>Places App</NavLink>
        </h1>
        <div style={{ width: '100%' }} id="input--hook"></div>
        <nav className='main-navigation__header-nav'>
          <NavLinks />
        </nav>
      </div>
    </header >
  );
}

export default MainHeader;
