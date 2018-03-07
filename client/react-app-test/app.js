import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'


try{
ReactDOM.render(<App/>, document.getElementById('app-root'));}
catch(err){console.log('apperr',err)}
