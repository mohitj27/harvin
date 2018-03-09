import React,{Component} from 'react'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import {Provider} from 'react-redux'
import {createStore,applyMiddleware} from 'redux'
import article from '../reducers/article'
import Layout from './Layout'
import Button from 'material-ui/Button';
import thunk from 'redux-thunk'



const store=createStore((state={})=>state,
applyMiddleware(thunk)
)
export default  () => (
  <Provider store={store}>
<Layout/>
</Provider>



);
