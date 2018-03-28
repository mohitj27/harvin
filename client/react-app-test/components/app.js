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
import axios from 'axios'

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f))
  class App extends Component{
    constructor(props){
      super(props)
      this.state={loginState:null}
    }
    getLoginStatus() {
      axios.get('/studentApp/home/loginState').then(res=>{
        // console.log(res)
      })
      return 'loggedout'
    }
    componentDidMount() {
      this.setState({loginState: this.getLoginStatus()})

    }
    render(){

          if (!this.state.loginState) {
            return (<CircularProgress justify="center"/>)
          }
          if(this.state.loginState==='loggedout'){
          return (  <LoginComponent/>)
          }

          if(this.state.loginState==='loggedin'){
            return(
              <Provider store={store}>
                <MuiThemeProvider theme={HarvinTheme}>
                  <Layout/>
                </MuiThemeProvider>
              </Provider>
            )
          }

    }
  }
export default App
