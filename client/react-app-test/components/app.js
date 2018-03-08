import React,{Component} from 'react'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import article from '../reducers/article'
import Layout from './Layout'
import Button from 'material-ui/Button';



const store=createStore(article)
export default  () => (
  <Provider store={store}>
<Layout/>
</Provider>



);
