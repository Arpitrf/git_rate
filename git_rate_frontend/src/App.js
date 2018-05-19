import React, { Component } from 'react';
import {BrowserRouter,Route,Link} from 'react-router-dom';
import Search from './Search'
import Home from './Home'
import Org from './Org'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Search/>
      </BrowserRouter>
    );
  }
}

export default App;
