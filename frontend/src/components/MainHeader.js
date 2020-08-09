import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import Sidedrawer from './Sidedrawer';
import Backdrop from './Backdrop';

const MainHeader = () => {

  const [isSidedrawerOpen, setIsSidedrawerOpen] = useState(false);

  return (
    <header className='main-header'>
      {isSidedrawerOpen && <Backdrop onClick={() => setIsSidedrawerOpen(false)} />}
      {
        isSidedrawerOpen && <Sidedrawer>
          <nav className="main-navigation__drawer-nav">
            <NavLinks />
          </nav>
        </Sidedrawer>
      }
      <button onClick={() => setIsSidedrawerOpen(true)} className='main-navigation__menu-btn'>
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
