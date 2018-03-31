import React, {Component} from 'react'
import HarvinTheme from './theme/HarvinTheme'
import {MuiThemeProvider} from 'material-ui/styles';
import rootReducer from '../reducers/rootReducer'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware,compose} from 'redux'
import LoginComponent from './login/LoginComponent'
import article from '../reducers/article'
import Layout from './Layout'
import Button from 'material-ui/Button';
import thunk from 'redux-thunk'
import {CircularProgress} from 'material-ui/Progress'
import {connect} from 'react-redux'
import axios from 'axios'

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f))
  class App extends Component{
    constructor(props){
      super(props)
    }

    render(){


          if(!this.props.loginState){
          return (  <LoginComponent/>)
          }

          if(this.props.loginState){
            return(
                <MuiThemeProvider theme={HarvinTheme}>
                  <Layout/>
                </MuiThemeProvider>
            )
          }

    }
  }
  function mapStateToProps(state){
    console.log('is auth',state)
    return {
      loginState:state.login_reducer.isAuthenticated
    }
  }
export default connect(mapStateToProps)(App)
