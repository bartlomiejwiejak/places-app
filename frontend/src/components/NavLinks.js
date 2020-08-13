import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

function NavLinks() {

  const { isLoggedIn, logout, userId } = useContext(AuthContext);

  return (
    <nav className='nav-links'>
      <li>
        <NavLink exact to='/'>ALL USERS</NavLink>
      </li>
      {isLoggedIn &&
        <li>
          <NavLink exact to={`/${userId}/places`}>MY PLACES</NavLink>
        </li>}
      {isLoggedIn && <li>
        <NavLink exact to='/places/new'>ADD PLACE</NavLink>
      </li>}
      {!isLoggedIn &&
        <li>
          <NavLink exact to='/auth'>AUTHENTICATE</NavLink>
        </li>}
      {isLoggedIn &&
        <li>
          <button onClick={logout}>LOGOUT</button>
        </li>}
    </nav>
  )
}

export default NavLinks
