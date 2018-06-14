import React, { Component } from 'react'
import { withAlert } from 'react-alert'
 
class App extends Component  {
  render () {
    return (
      <button
        onClick={() => {
          this.props.alert.show('Oh look, an alert!')
        }}
      >
        Show Alert
      </button>
    )
  }
}
 
export default withAlert(App)