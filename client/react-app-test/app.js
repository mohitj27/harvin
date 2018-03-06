import React from 'react'
import ReactDOM from 'react-dom'
import Axios from 'axios'
import RegisterComponent from './components/RegisterComponent'
import LoginComponent from './components/LoginComponent'
import MyAwesomeReactComponent from './components/MyAwesomeReactComponent'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => (
  <MuiThemeProvider>
    <MyAwesomeReactComponent />
  </MuiThemeProvider>
);

try{
ReactDOM.render(<App/>, document.getElementById('app-root'));}
catch(err){console.log('apperr',err)}

try{
ReactDOM.render(<LoginComponent/>, document.getElementById('LoginComponent'));}
catch(err){}

try {
  ReactDOM.render(<RegisterComponent/>,document.getElementById('RegisterComponent'))

} catch (e) {

}
