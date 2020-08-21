import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';
import useAuth from '../hooks/useAuth';
import MainHeader from './layout/MainHeader';

const Users = React.lazy(() => {
  return import('./views/Users');
})
const User = React.lazy(() => {
  return import('./views/User');
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
const Start = React.lazy(() => {
  return import('./views/Start');
})
const UpdateUser = React.lazy(() => {
  return import('./views/UpdateUser')
})
const Home = React.lazy(() => {
  return import('./views/Home')
})

export default function () {

  const { login, userId, token, logout, userImage, userName, updateUser, following, followers, updateFollow } = useAuth();

  let routes;

  if (!token) {
    routes = (
      <Switch>
        <Route path='/' exact component={Start} />
        <Route path='/users' exact component={Users} />
        <Route path='/auth' exact component={Auth} />
        <Route path='/:userId/places' exact component={User} />
        <Redirect to='/auth' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact component={Start} />
        <Route path='/home' exact component={Home} />
        <Route path='/users' exact component={Users} />
        <Route path='/users/:id' exact component={UpdateUser} />
        <Route path='/:userId/places' exact component={User} />
        <Route path='/places/new' exact component={NewPlace} />
        <Route path='/places/:placeId' component={UpdatePlace} />
        <Redirect to='/home' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{ following: following, followers: followers, login: login, logout: logout, userId: userId, isLoggedIn: !!token, token: token, userImage: userImage, userName: userName, updateUser: updateUser, updateFollow: updateFollow }}>
      <MainHeader />
      <Suspense fallback={null}>
        <main>
          {routes}
        </main>
      </Suspense>
    </AuthContext.Provider>
  );
}