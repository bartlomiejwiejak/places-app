import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Users from './pages/Users';
import MainHeader from './components/MainHeader';
import UserPlaces from './pages/UserPlaces';
import NewPlace from './pages/NewPlace';
import UpdatePlace from './pages/UpdatePlace';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
