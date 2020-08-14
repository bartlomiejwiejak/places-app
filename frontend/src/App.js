import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Users from './pages/Users';
import MainHeader from './components/MainHeader';
import UserPlaces from './pages/UserPlaces';
import NewPlace from './pages/NewPlace';
import UpdatePlace from './pages/UpdatePlace';
import Auth from './pages/Auth';
import { AuthContext } from './context/auth-context';

function App() {

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userId, token) => {
    setUserId(userId)
    setToken(token)
  }

  const logout = () => {
    setUserId(null)
    setToken(null)
  }

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
