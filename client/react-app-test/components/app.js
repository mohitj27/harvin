import React, {Component} from 'react'
import HarvinTheme from './theme/HarvinTheme'
import {MuiThemeProvider} from 'material-ui/styles';
import rootReducer from '../reducers/rootReducer'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware,compose} from 'redux'
import article from '../reducers/article'
import Layout from './Layout'
import Button from 'material-ui/Button';
import thunk from 'redux-thunk'

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f))
export default() => (<Provider store={store}>
  <MuiThemeProvider theme={HarvinTheme}>
    <Layout/>
  </MuiThemeProvider>
</Provider>);
