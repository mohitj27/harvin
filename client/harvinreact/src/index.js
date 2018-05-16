import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import './assets/css/material-dashboard-react.css';
import rootReducer from './reducers/index';
import indexRoutes from './routes/index.jsx';
import logger from 'redux-logger';

import jwt from 'jsonwebtoken';
import setAuthToken from './config/setAuthToken';
import url from './config';
import Login from './containers/Login/Login';
import Public from './views/Public/Public';
import Dashboard from './views/Dashboard/Dashboard.jsx';

const hist = createBrowserHistory();
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk, logger));

const store = createStore(rootReducer, enhancer);
let App = null;
const studentHome = null;
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      let token = localStorage.getItem('token');
      let decoded = jwt.decode(token);
      let date = Date.now() / 1000;
      // console.log("condition", token, decoded);
      if (token && decoded && decoded.exp >= date === true) {
        setAuthToken(token);
        decoded = jwt.decode(token);
        store.dispatch({
          type: 'LOGIN_SUCCESS',
          currentUser: decoded,
        });
        return <Component {...props} />;
      } else {
        // console.log("calling login");
        return <Redirect to="/login" />;
      }
    }}

  />
);
App = (
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/public" component={Public} />
        <Route path="/login" component={Login} />
        <Route path="/quiz/:id" component={Dashboard}/>
        {indexRoutes.map((prop, key) => {
          return (
            <PrivateRoute
              path={prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
      </Switch>
    </Router>
  </Provider>
);
ReactDOM.render(App, document.getElementById('root'));
