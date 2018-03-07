import React,{Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import article from '../reducers/article'
import Layout from './Layout'


const store=createStore(article)
export default  () => (<Provider store={store}>
<Layout/>
</Provider>
);
