import React from 'react';
import { Route } from 'react-router-dom';
import Users from './pages/Users';

function App() {
  return (
    <div className="App">
      <Route path='/' component={Users} />
    </div>
  );
}

export default App;
