import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Users from './pages/Users';
import MainHeader from './components/MainHeader';
import UserPlaces from './pages/UserPlaces';
import NewPlace from './pages/NewPlace';

function App() {
  return (
    <div className="App">
      <MainHeader />
      <main>
        <Switch>
          <Route path='/' exact component={Users} />
          <Route path='/:userId/places' exact component={UserPlaces} />
          <Route path='/places/new' component={NewPlace} />
          <Redirect to='/' />
        </Switch>
      </main>
    </div>
  );
}

export default App;
