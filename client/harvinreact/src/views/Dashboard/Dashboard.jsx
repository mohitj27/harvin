import React, { Fragment } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/img/loginHosp.jpg";
import { withStyles, Grid } from "material-ui";
import Quiz from "../../components/Quiz/Quiz";
import { EditorState } from "draft-js";
import { loginAction, notifyClear } from "../../actions";
import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import { RegularCard, ItemGrid } from "../../components";

import dashboardStyle from "../../variables/styles/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentDidMount = () => {
    // console.log("testid", this.props.match.params.id);
    this.props.onTestFetch("5af93fb55edc0b640f2c26f5");
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
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

    let testName =
      this.props.test && this.props.test.name ? this.props.test.name : "";

    return (
      <Fragment>
        {successSnackbar}
        {errorSnackbar}
        {loadingSnackbar}
        {testName}
        <Quiz
          quizEditorState={EditorState.createEmpty()}
          height={500}
          width={500}
        />
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    test: state.test.test,
    isFetchTestInProgress: state.test.isFetchTestInProgress,
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
    currentUser: state.auth.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTestFetch: id => dispatch(actions.fetchTest(id)),
    onClearToast: () => dispatch(notifyClear())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(dashboardStyle)(Dashboard)
);
