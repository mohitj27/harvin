import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch,Redirect } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import "./assets/css/material-dashboard-react.css";
import rootReducer from "./reducers/index";
import indexRoutes from "./routes/index.jsx";
import logger from "redux-logger";
import setAuthToken from './config/setAuthToken'
import url from './config'

const hist = createBrowserHistory();
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk, logger)
);
let token = localStorage.getItem('token')
console.log('token',token);
if(url=='http://localhost:3010')
token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMSIsInJvbGUiOlsiZ3Vlc3QiXSwiX2lkIjoiNWFkMGM0OWU4MWVkNDY3NWE0ZmNkMTI4IiwiaWF0IjoxNTIzNzAyMzg4LCJleHAiOjE1MjQzMDcxODh9.2ulNBVcB5sVfJqRMUP-EUutoJExuoLqr3nqo0SLeiYU'
setAuthToken(token);
const store = createStore(rootReducer, enhancer);
let App = null;

App = (<Provider store={store}>
  <Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return (
          <Route path={prop.path} component={prop.component} key={key} />
        );
      })}
    </Switch>
  </Router>
</Provider>);
ReactDOM.render(App
  ,
  document.getElementById("root")
);
