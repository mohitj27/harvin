import React from 'react'
import App from './components/app'
import ReactDOM from 'react-dom'
import LoginComponent from './components/login/LoginComponent'
import RegisterComponent from './components/login/RegisterComponent'
import {BrowserRouter} from 'react-router-dom'

try{

ReactDOM.render(<App/>, document.getElementById('app-root'));}
catch(err){console.log('apperr',err)}

try{
ReactDOM.render(<LoginComponent/>, document.getElementById('LoginComponent'));}
catch(err){console.log('apperr',err)}

try{
ReactDOM.render(<RegisterComponent/>, document.getElementById('RegisterComponent'));}
catch(err){console.log('apperr',err)}
