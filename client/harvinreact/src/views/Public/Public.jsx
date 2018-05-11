import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { signupAction, getBatches, notifyClear } from "../../actions";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import loginStyles from "../../variables/styles/loginStyles";
import {
  Grid,
  Paper,
  withStyles,
  Button,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem
} from "material-ui";
import logo from "../../assets/img/harvinLogo.png";

class Public extends React.Component {
  state = {
    username: "",
    password: "",
    confirmPassword: "",
    batch: ""
  };
  signup = e => {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      alert("Confirm password is not same as password !!!");
      return;
    }
    this.props.signupAction({
      username: this.state.username,
      password: this.state.password,
      batch: this.state.batch
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentWillMount = () => {
    this.props.getBatches();
  };

  render() {
    const { classes } = this.props;
    let successSnackbar =
      this.props.successMessage !== "" ? (
        <SuccessSnackbar
          successMessage={this.props.successMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let errorSnackbar =
      this.props.errorMessage !== "" ? (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let loadingSnackbar =
      this.props.notifyLoading !== "" ? <LoadingSnackbar /> : null;

    if (this.props.isAuthenticated === true) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className={classes.root}>
        {successSnackbar}
        {errorSnackbar}
        {loadingSnackbar}
        <Paper>
          <Grid
            container
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
          >
            <Grid item="item" xs={6}>
              <Grid
                container
                direction={"row"}
                justify={"center"}
                alignItems={"center"}
              >
                <img src={logo} alt="harvin logo" style={{ height: "50px" }} />
              </Grid>
            </Grid>
            <Grid item="item" xs={6}>
              <Grid container="container" direction="column" justify="center">
                <Grid item="item" xs={12} className={classes.centerItem}>
                  <FormControl
                    fullWidth="fullWidth"
                    className={` ${classes.formControl}`}
                  >
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input
                      id="username"
                      value={this.state.username}
                      type="text"
                      name="username"
                      onChange={this.handleChange}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth="fullWidth"
                    className={` ${classes.formControl}`}
                  >
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                      id="password"
                      value={this.state.password}
                      type="password"
                      name="password"
                      onChange={this.handleChange}
                    />
                  </FormControl>
                  <FormControl
                    fullWidth="fullWidth"
                    className={` ${classes.formControl}`}
                  >
                    <InputLabel htmlFor="password">Confirm Password</InputLabel>
                    <Input
                      id="confirmPassword"
                      value={this.state.confirmPassword}
                      type="password"
                      name="confirmPassword"
                      onChange={this.handleChange}
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel>Choose your batch</InputLabel>
                    <Select
                      value={this.state.batch}
                      style={{ width: "100%" }}
                      onChange={this.handleChange}
                      inputProps={{ name: "batch", id: "batch" }}
                    >
                      {this.props.batches.map((batch, i) => {
                        return (
                          <MenuItem key={i} value={batch._id}>
                            {batch.batchName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <br />
                  <Button
                    variant="raised"
                    onClick={this.signup}
                    className={classes.raisedButton}
                  >
                    Signup
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
    batches: state.batch.batches || []
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signupAction,
      getBatches,
      onClearToast: () => dispatch(notifyClear())
    },
    dispatch
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(loginStyles)(Public))
);
