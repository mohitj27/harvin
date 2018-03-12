import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import {CircularProgress} from 'material-ui/Progress'
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';

class RegisterComponent extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      batches: null,
      username: '',
      password: '',
      fullName: '',
      emailId: '',
      phone: '',
      selectedBatch: null
    }
  }
  componentDidMount() {
    axios.get('/admin/batches').then((res) => {
      console.log(res.data)
      this.setState({batches: res.data.batches})
    })
  }
  batchSelect() {

    if (this.state.batches)
      return (<TextField id="select-currency" select="select" value={this.state.selectedBatch || 'batch'} onChange={this.onChange} name="selectedBatch" helperText="Please select your Batch" margin="normal">
        {
          this.state.batches.map(batch => (<MenuItem key={batch._id} value={batch.batchName}>
            {batch.batchName}
          </MenuItem>))
        }
      </TextField>)
    else
      return <CircularProgress/>
  }
  onSubmit(e) {
    e.preventDefault()
    axios.post('/student/signup', {username:this.state.username ,password:this.state.password, fullName:this.state.fullName, emailId:this.state.emailId, phone:this.state.phone, batch:this.state.selectedBatch}).then(res => {
      console.log(res)
      window.location.replace('/student/login')
    })
  }
  onChange(e) {
    e.preventDefault()
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const {state} = this.state
    return <div className="container">
      <h3 className="center-align">Register a new Account</h3>
      <hr/>
      <br/>
      <form onSubmit={this.onSubmit}>
        <div className="row">
          <div className="col s12 m6 input-field">
            <input id="username" name="username" type="text" onChange={this.onChange} value={state} className="validate"/>
            <label htmlFor="username">User Name</label>
          </div>
          <div className="col s12 m6 input-field">
            <input id="password" name="password" type="password" onChange={this.onChange} value={state} className="validate"/>
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6 input-field">
            <input id="fullName" name="fullName" type="text" onChange={this.onChange} value={state} className="validate"/>
            <label htmlFor="fullName">Full Name</label>
          </div>
          <div className="col s12 m6 input-field">
            <input id="emailId" name="emailId" type="email" onChange={this.onChange} value={state} className="validate"/>
            <label htmlFor="emailId">Email Id</label>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m6 input-field">
            <input id="phone" name="phone" type="number" value={state} onChange={this.onChange} min="1111111111" max="9999999999" className="validate"/>
            <label htmlFor="phone">Phone</label>
          </div>
          <div className="col s12 m6 input-field">
            {this.batchSelect()}
          </div>
        </div>

        <div className="center-align">
          <button type="submit" className="btn">Submit</button>
        </div>
      </form>
    </div>

  }
}
export default RegisterComponent
