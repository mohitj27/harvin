import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signupAction, getBatchList } from '../../actions';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import loginStyles from '../../variables/styles/loginStyles';
import {
  Grid,
  Paper,
  withStyles,
  Button,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from 'material-ui';
import logo from '../../assets/img/harvinLogo.png';
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },

  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

class Public extends React.Component {
  state = {
    redirectToReferrer: false,
    username: '',
    password: '',
    batch: [],
    confirmPassword: '',
  };
  signup = (e) => {
    e.preventDefault();
    this.props.signupAction({ username: this.state.username, password: this.state.password, batch: this.state.batch });
  };

  handleChange = e => {
    console.log('change', e.target.name);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentWillMount=()=> {

      const batchList = this.props.getBatchList();
      this.setState({ batch:  batchList || [] });
    };

  render() {
    const { redirectToReferrer } = this.state;
    const { classes } = this.props;

    if (redirectToReferrer === true) {
      return (<Redirect to='/dashboard'/>);
    }

    return (<div className={classes.root}>
      <Paper >
        <Grid container="container" className={classes.centerContainer}>
          <Grid item="item" xs={6}>
            <img src={logo} alt="harvin logo" style={{
                height: '50px',
              }}/>
          </Grid>
          <Grid item="item" xs={6}>
            <Grid container="container" direction="column" justify="center">
              <Grid item="item" xs={12} className={classes.centerItem}>
                <FormControl fullWidth="fullWidth" className={classes.marginBottom}>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input id="username" value={this.state.username} type="text" name="username" onChange={this.handleChange}/>
                </FormControl>
                <FormControl fullWidth="fullWidth" className={classes.marginBottom}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input id="password" value={this.state.password} type="password" name="password" onChange={this.handleChange}/>
                </FormControl>
                <FormControl fullWidth="fullWidth" className={classes.marginBottom}>
                  <InputLabel htmlFor="password">Confirm Password</InputLabel>
                  <Input id="confirmPassword" value={this.state.confirmPassword} type="password" name="confirmPassword" onChange={this.handleChange}/>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-simple">Age</InputLabel>
                  <Select value="batch" onChange={this.handleChange} inputProps={{
                      name: 'batch',
                      id: 'batch',
                    }}>
                    {this.state.batch.map((batch, i)=> {
                      return <MenuItem key={i} value={batch}>{batch}</MenuItem>;
                    })}
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              <br/>
                <Button variant="raised" onClick={this.signup} className={classes.raisedButton}>
                  Signup
                </Button>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>);
  }
}
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    signupAction,
    getBatchList,
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(loginStyles)(Public)));
