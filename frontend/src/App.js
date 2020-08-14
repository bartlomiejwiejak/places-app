import React, { useState, useEffect, useCallback } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Users from './pages/Users';
import MainHeader from './components/MainHeader';
import UserPlaces from './pages/UserPlaces';
import NewPlace from './pages/NewPlace';
import UpdatePlace from './pages/UpdatePlace';
import Auth from './pages/Auth';
import { AuthContext } from './context/auth-context';

let logoutTimeout;

function App() {

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const logout = useCallback(() => {
    setUserId(null)
    setToken(null)
    localStorage.removeItem('userData')
    if (logoutTimeout) {
      clearTimeout(logoutTimeout)
    }
  }, [])

  const login = useCallback((userId, token, expirationDate) => {
    setUserId(userId)
    setToken(token)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    localStorage.setItem('userData', JSON.stringify({ userId, token, expiration: tokenExpirationDate.toISOString() }))
    logoutTimeout = setTimeout(() => {
      logout();
    }, tokenExpirationDate.getTime() - new Date().getTime())
  }, [logout])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  let routes;

  if (!token) {
    routes = (
      <Switch>
        <Route path='/' exact component={Users} />
        <Route path='/auth' exact component={Auth} />
        <Route path='/:userId/places' exact component={UserPlaces} />
        <Redirect to='/auth' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact component={Users} />
        <Route path='/:userId/places' exact component={UserPlaces} />
        <Route path='/places/new' exact component={NewPlace} />
        <Route path='/places/:placeId' component={UpdatePlace} />
        <Redirect to='/' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{ login: login, logout: logout, userId: userId, isLoggedIn: !!token, token: token }}>
      <MainHeader />
      <main>
        {routes}
      </main>
    </AuthContext.Provider>
  );
}

export default App;
