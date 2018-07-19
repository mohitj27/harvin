import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import './assets/css/material-dashboard-react.css';
import rootReducer from './reducers/index';
import indexRoutes from './routes/index.jsx';
import logger from 'redux-logger';

import jwt from 'jsonwebtoken';
import setAuthToken from './config/setAuthToken';
import removeAuthToken from './config/removeAuthToken';

import url from './config';
import Login from './containers/Login/Login';
import Public from './views/Public/Public';
import Dashboard from './views/Dashboard/Dashboard.jsx';
import ApplicantLogin from './views/ApplicantLogin/ApplicantLogin.jsx';
import Result from './views/Result/Result.jsx';

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
        return <Redirect to="/HarvinQuiz/login" />;
      }
    }}

  />
);
App = (
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/HarvinQuiz/public" component={Public} />
        <Route path="/HarvinQuiz/login" component={Login} />
        <Route path="/HarvinQuiz/quiz/:id" component={Dashboard} />
        <Route path="/HarvinQuiz/applicant/login" component={ApplicantLogin} />
        <Route path="/HarvinQuiz/applicant/result" component={Result} />
        <Route path="/HarvinQuiz/applicant/" render={(props) => {
          return (<ApplicantLogin />);
        }} />
        <Route path="/HarvinQuiz/Logout" render={(props) => {
          removeAuthToken();
          return (
            <Login />
          )
        }} />
        {indexRoutes.map((prop, key) => {
          console.log('prop', prop);
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
