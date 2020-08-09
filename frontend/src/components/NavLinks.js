import React from 'react'
import { NavLink } from 'react-router-dom';

function NavLinks() {
  return (
    <nav className='nav-links'>
      <li>
        <NavLink exact to='/'>ALL USERS</NavLink>
      </li>
      <li>
        <NavLink exact to='/u1/places'>MY PLACES</NavLink>
      </li>
      <li>
        <NavLink exact to='/palces/new'>ADD PLACE</NavLink>
      </li>
      <li>
        <NavLink exact to='/auth'>AUTHENTICATE</NavLink>
      </li>
    </nav>
  )
}

export default NavLinks
