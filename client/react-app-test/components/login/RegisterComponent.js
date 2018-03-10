import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { CircularProgress } from 'material-ui/Progress'

class RegisterComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      batches: null
    }
  }
  componentWillMount() {
    axios.get('/admin/batches').then((res) => {
      console.log(res.data)
      this.setState({batches:res.data.batches})
    })
  }
  batchSelect() {
    if (this.state.batches)
      return (<select name="batch">
        <option value="" disabled="disabled" selected="selected">Choose your option</option>
        {
          this.state.batches.map((batch) => {
            <option value={batch.batchName}>{batch.batchName}</option>
          })
        }</select>
    )
    else
      return <CircularProgress className={classes.progress}/>
  }
  render() {

    return <div class="container">
      <h3 class="center-align">Register a new Account</h3>
      <hr/>
      <br/>
      <form action="/student/signup" method="post">
        <div class="row">
          <div class="col s12 m6 input-field">
            <input id="username" name="username" type="text" class="validate"/>
            <label for="username">User Name</label>
          </div>
          <div class="col s12 m6 input-field">
            <input id="password" name="password" type="text" class="validate"/>
            <label for="password">Password</label>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6 input-field">
            <input id="fullName" name="fullName" type="text" class="validate"/>
            <label for="fullName">Full Name</label>
          </div>
          <div class="col s12 m6 input-field">
            <input id="emailId" name="emailId" type="email" class="validate"/>
            <label for="emailId">Email Id</label>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m6 input-field">
            <input id="phone" name="phone" type="number" min="1111111111" max="9999999999" class="validate"/>
            <label for="phone">Phone</label>
          </div>
          <div class="col s12 m6 input-field">
            {this.batchSelect}
            <label>Select Batch</label>
          </div>
        </div>

        <div class="center-align">
          <button type="submit" class="btn">Submit</button>
        </div>
      </form>
    </div>

  }
}
export default RegisterComponent
