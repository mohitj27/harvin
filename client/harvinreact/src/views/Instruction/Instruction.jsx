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
import { Link } from "react-router-dom";
import { Send, Inbox, Star, StarBorder } from "material-ui-icons";
import Icon from "@material-ui/core/Icon";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import { RegularCard, ItemGrid } from "../../components";
import instructionStyles from "../../variables/styles/instructionStyle";

class Instruction extends React.Component {
  state = {
    value: 0,
    test: "",
    haveReadAllInstructions: false,
    isTestStarted: false
  };

  handleChange = () => {
    this.setState({
      haveReadAllInstructions: !this.state.haveReadAllInstructions
    });
  };

  onTestStart = () => {
    this.setState({
      isTestStarted: !this.state.isTestStarted
    });
  };

  componentDidMount = () => {
    // console.log("testid", this.props.match.params.id);
    this.props.onTestFetch("5afc159a355e75294a039352");
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.test) {
      return {
        test: nextProps.test
      };
    }
    return null;
  };

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

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container="container">
          <ItemGrid xs={12}>
            <RegularCard
              cardTitle="Instuction"
              cardSubtitle="Please read all these instuctions carefully"
              headerColor="blue"
              content={this.getCardContent()}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}

Instruction.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    test: state.test.test,
    isFetchTestInProgress: state.test.isFetchTestInProgress
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTestFetch: id => dispatch(actions.fetchTest(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(instructionStyles)(Instruction)
);
