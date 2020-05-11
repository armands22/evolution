import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.css";
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import reducers from './reducers';
import App from './App';
import Start from "./Start";

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/game/:id" exact component={(props) => <App {...props} />} />
        <Route component={Start} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
