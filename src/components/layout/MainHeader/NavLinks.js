import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../../context/auth-context';
import Avatar from '../../shared/Avatar';

function NavLinks() {

  const { isLoggedIn, logout, userId, userImage, userName } = useContext(AuthContext);

  return (
    <nav className='nav-links'>
      <li>
        <NavLink exact to='/home'><i className="fas fa-home"></i></NavLink>
      </li>
      <li>
        <NavLink exact to='/users'><i className="fas fa-user-friends"></i></NavLink>
      </li>
      {isLoggedIn && <li>
        <NavLink exact to='/places/new'><i className="fas fa-plus"></i></NavLink>
      </li>}
      {!isLoggedIn &&
        <li>
          <NavLink exact to='/auth'><i className="fas fa-sign-in-alt"></i></NavLink>
        </li>}
      {isLoggedIn &&
        <li>
          <button onClick={logout}><i className="fas fa-sign-out-alt"></i></button>
        </li>}
      {isLoggedIn &&
        <li>
          <NavLink exact to={`/${userId}/places`}><Avatar style={{ width: '3rem', height: '3rem' }} image={`http://192.168.8.132:5000/${userImage}`} alt='User' /><span className='user-name'>{userName}</span></NavLink>
        </li>}
    </nav>
  )
}

export default NavLinks
