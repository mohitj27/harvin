import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginAction, notifyClear } from '../../actions';
import "./../../variables/styles/login.css";
import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from '../../components/GlobalSnackbar/GlobalSnackbar';
import {
  Redirect,
  withRouter
} from 'react-router-dom';
import loginStyles from '../../variables/styles/loginStyles';
import { Grid, Paper, withStyles, Button } from 'material-ui';
import logo from '../../assets/img/harvinLogo.png';

class Login extends React.Component {
  constructor(props) {
    super(props);
    // console.log("called");
  }

  state = {
    isAuthenticated: false,
    isLoginInProgress: false,
    username: '',
    password: '',
  };
  login = e => {
    e.preventDefault();
    this.props.loginAction({
      username: this.state.username,
      password: this.state.password,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      !nextProps.isLoginInProgress &&
      nextProps.successMessage ===
      'Successfully logged you in as ' + prevState.username
    ) {
      return {
        isLoginInProgress: false,
        isAuthenticated: true,
      };
    }

    return null;
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    // console.log("state", this.state);

    const { redirectToReferrer } = this.state;
    const { classes } = this.props;
    let successSnackbar =
      this.props.successMessage !== '' ? (
        <SuccessSnackbar
          successMessage={this.props.successMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let errorSnackbar =
      this.props.errorMessage !== '' ? (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let loadingSnackbar =
      this.props.notifyLoading !== '' ? <LoadingSnackbar /> : null;
    if (this.props.isAuthenticated === true && window.localStorage.getItem('token')) {
      return <Redirect to="/HarvinQuiz" />;
    }

    return (
      <div className={classes.root} style={{ display: "inlineBlock" }}>
        {successSnackbar}
        {errorSnackbar}
        {loadingSnackbar}
        <Paper className="mainGrid">
          <img src={logo} alt="harvin logo" className="imageLogo" />
          <Grid container className={classes.centerContainer} style={{ padding: "3%" }}>
            <Grid item xs={12} className={classes.centerContainer}>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} className={classes.centerContainer}>
                  <input
                    type="text"
                    onChange={this.onChange}
                    placeholder=" Username"
                    value={this.state.username}
                    name="username"
                  />
                </Grid>
                <Grid item xs={12} className={classes.centerContainer}>
                  <input
                    type="password"
                    onChange={this.onChange}
                    placeholder=" Password"
                    value={this.state.password}
                    name="password"
                  />
                </Grid>
                <Grid item xs={12} className={classes.centerContainer}>
                  <Button
                    variant="raised"
                    onClick={this.login}
                    className={classes.raisedButton}
                  >
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
    isAuthenticated: state.auth.isAuthenticated,
    isLoginInProgress: state.auth.isLoginInProgress,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { loginAction, onClearToast: () => dispatch(notifyClear()) },
    dispatch
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(loginStyles)(Login))
);
