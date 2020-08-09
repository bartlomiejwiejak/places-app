import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Users from './pages/Users';
import MainHeader from './components/MainHeader';

function App() {
  return (
    <div className="App">
      <MainHeader />
      <main>
        <Switch>
          <Route path='/' exact component={Users} />
          <Redirect to='/' />
        </Switch>
      </main>
    </div>
  );
}

export default App;
