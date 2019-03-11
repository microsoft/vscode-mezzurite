import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Header from './Header/Header';
import GBForm from './GBForm/GBForm';
import GBList from './GBList/GBList';
import GBBottom from './GBBottom/GBBottom';

import AppContainer from './AppContainer.js';

class ReactNotInstrumentedParentheses extends Component {
  render() {
    return (
        <Router>
          <AppContainer>
            <Header />
            <Route exact path="/" component={GBForm} />
            <Route exact path="/guestbook" component={GBList} />
            <GBBottom />
          </AppContainer>
        </Router>
    );
  }
}

App.displayName = 'App';
export default (ReactNotInstrumentedParentheses);
