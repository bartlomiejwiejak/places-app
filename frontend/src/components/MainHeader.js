import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import Sidedrawer from './Sidedrawer';
import Backdrop from './Backdrop';

const MainHeader = () => {

  const [isSidedrawerOpen, setIsSidedrawerOpen] = useState(false);

  const closeSidedrawerHandler = () => {
    setIsSidedrawerOpen(false)
  }

  const openSidedrawerHandler = () => {
    setIsSidedrawerOpen(true)
  }

  return (
    <header className='main-header'>
      <Backdrop show={isSidedrawerOpen} onClick={closeSidedrawerHandler} />
      <Sidedrawer isSidedrawerOpen={isSidedrawerOpen} onClick={closeSidedrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </Sidedrawer>
      <button onClick={openSidedrawerHandler} className='main-navigation__menu-btn'>
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
