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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}>
      <MainHeader />
      <main>
        <Switch>
          <Route path='/' exact component={Users} />
          <Route path='/:userId/places' exact component={UserPlaces} />
          <Route path='/places/new' component={NewPlace} />
          <Route path='/places/:placeId' component={UpdatePlace} />
          <Route path='/auth' exact component={Auth} />
          <Redirect to='/' />
        </Switch>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
