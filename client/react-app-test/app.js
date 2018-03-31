import React from 'react'
import App from './components/app'
import ReactDOM from 'react-dom'
import LoginComponent from './components/login/LoginComponent'
import RegisterComponent from './components/login/RegisterComponent'
import {BrowserRouter} from 'react-router-dom'
import rootReducer from './reducers/rootReducer'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {createStore, applyMiddleware,compose} from 'redux'
import jwt from 'jsonwebtoken'
import {setCurrentUser} from './actions/login_action'
import setAuthorizationToken from './utils/setAuthorization'


const store = createStore(rootReducer, compose(
  applyMiddleware(thunk), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f))
if(localStorage.jwttoken){
  setAuthorizationToken(localStorage.jwttoken)
  store.dispatch(setCurrentUser(jwt.decode(localStorage.jwttoken)))
}
class RootApp extends React.Component{


  render(){
    return (<Provider store={store}>
      <App/>
    </Provider>)
  }

}

try{

ReactDOM.render(
<RootApp/>, document.getElementById('app-root'));}
catch(err){console.log('apperr',err)}

try{
ReactDOM.render(<LoginComponent/>, document.getElementById('LoginComponent'));}
catch(err){console.log('apperr',err)}

try{
ReactDOM.render(<RegisterComponent/>, document.getElementById('RegisterComponent'));}
catch(err){console.log('apperr',err)}
