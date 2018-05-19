import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "material-ui";

import { RegularCard, ItemGrid } from "../../components";
import { Link } from "react-router-dom";
import { Send, Star } from "material-ui-icons";
import Icon from "@material-ui/core/Icon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Quiz from "../../components/Quiz/Quiz";
import { notifyClear } from "../../actions";
import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import { connect } from "react-redux";
import * as actions from "../../actions";

import dashboardStyle from "../../variables/styles/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    test: "",
    haveReadAllInstructions: false,
    isTestStarted: false
  };

  handleChange = () => {
    this.setState({
      haveReadAllInstructions: !this.state.haveReadAllInstructions
    });
  };

  componentDidMount = () => {
    this.props.onTestFetch(this.props.match.params.id);
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.test) {
      return {
        test: nextProps.test
      };
    }
    return null;
  };

  onTestStart = () => {
    this.setState({
      isTestStarted: !this.state.isTestStarted
    });
  };

  // instruction screen
  getCardContent = () => {
    const { classes } = this.props;
    let sections = null;
    if (
      this.state.test &&
      this.state.test.sections &&
      this.state.test.sections.length > 0
    ) {
      sections = (
        <Fragment>
          <ListItem>
            <ListItemIcon>
              <Star />
            </ListItemIcon>
            <ListItemText
              primary={`sections: ${this.state.test.sections.length}`}
            />
          </ListItem>

          {this.state.test.sections.map((section, i) => {
            if (section) {
              return (
                <Fragment>
                  <ListItem>
                    <ListItemIcon>
                      <Star />
                    </ListItemIcon>
                    <ListItemText
                      primary={`section ${i + 1}: ${section.title}  have: ${
                        section.questions.length
                      } questions`}
                    />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <ListItemText
                      primary={`${
                        section.posMarks
                      } will be awarded for each correct answer and`}
                    />
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <ListItemText
                      primary={`${Math.abs(
                        section.negMarks
                      )} will be deducted for each incorrect answer`}
                    />
                  </ListItem>
                </Fragment>
              );
            } else {
              return null;
            }
          })}
        </Fragment>
      );
    }
    let cardContent;
    console.log("test", this.state.test.name);

    if (this.state.test == "") {
      cardContent = (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    } else {
      cardContent = (
        <Grid container="container">
          <ItemGrid xs={1} />
          <ItemGrid xs={10}>
            <Fragment>
              <Typography
                variant="headline"
                gutterBottom
                className={classes.title}
              >
                {this.state.test.name}
              </Typography>
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText
                  primary={`Max marks: ${this.state.test.maxMarks}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary={`time: ${this.state.test.time}`} />
              </ListItem>
              {sections}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.haveReadAllInstructions}
                    onChange={this.handleChange}
                    value="haveReadAllInstructions"
                  />
                }
                label="I have read all the instructions carefully"
              />
              <div className={classes.startBtn}>
                <Button
                  className={classes.button}
                  disabled={!this.state.haveReadAllInstructions}
                  variant="raised"
                  color="primary"
                  onClick={this.onTestStart}
                >
                  {`Start the Test `}
                  <Send className={classes.startIcon} />
                </Button>
              </div>
            </Fragment>
          </ItemGrid>
          <ItemGrid xs={1} />
        </Grid>
      );
    }
    return cardContent;
  };

  //
  render() {
    let testScreen = null;
    if (this.state.isTestStarted) {
      testScreen = (
        <Fragment>
          <Quiz test={this.props.test} height={500} width={500} />
        </Fragment>
      );
    } else {
      testScreen = (
        <Fragment>
          <Grid container="container">
            <ItemGrid xs={12}>
              <RegularCard
                cardTitle="Instuctions"
                cardSubtitle="Please read all these instuctions carefully"
                headerColor="blue"
                content={this.getCardContent()}
              />
            </ItemGrid>
          </Grid>
        </Fragment>
      );
    }
    return testScreen;
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
