import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';
import useAuth from '../hooks/useAuth';
import MainHeader from './layout/MainHeader';

const Users = React.lazy(() => {
  return import('./views/Users');
})
const UserPlaces = React.lazy(() => {
  return import('./views/UserPlaces');
})
const NewPlace = React.lazy(() => {
  return import('./views/NewPlace');
})
const Auth = React.lazy(() => {
  return import('./views/Auth');
})
const UpdatePlace = React.lazy(() => {
  return import('./views/UpdatePlace');
})
const Home = React.lazy(() => {
  return import('./views/Home');
})

export default function () {

  const { login, userId, token, logout } = useAuth();

  let routes;

  if (!token) {
    routes = (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/users' exact component={Users} />
        <Route path='/auth' exact component={Auth} />
        <Route path='/:userId/places' exact component={UserPlaces} />
        <Redirect to='/auth' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/users' exact component={Users} />
        <Route path='/:userId/places' exact component={UserPlaces} />
        <Route path='/places/new' exact component={NewPlace} />
        <Route path='/places/:placeId' component={UpdatePlace} />
        <Redirect to='/places/new' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{ login: login, logout: logout, userId: userId, isLoggedIn: !!token, token: token }}>
      <MainHeader />
      <Suspense fallback={null}>
        <main>
          {routes}
        </main>
      </Suspense>
    </AuthContext.Provider>
  );
}