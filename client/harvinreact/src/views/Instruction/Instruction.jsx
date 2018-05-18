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
  CardActions
} from "material-ui";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import { RegularCard, ItemGrid } from "../../components";
import instructionStyles from "../../variables/styles/instructionStyle";

class Instruction extends React.Component {
  state = {
    value: 0,
    test: ""
  };

  componentDidMount = () => {
    // console.log("testid", this.props.match.params.id);
    this.props.onTestFetch("5afd51ba95697e3aa6e232e6");
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
          <Typography
            variant="subheading"
            gutterBottom
            className={classes.title}
          >
            sections: {this.state.test.sections.length}
          </Typography>

          {this.state.test.sections.map((section, i) => {
            if (section) {
              return (
                <Fragment>
                  <Typography
                    variant="subheading"
                    gutterBottom
                    className={classes.title}
                  >
                    {`section ${i + 1}: ${section.title}  have: ${
                      section.questions.length
                    } questions`}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    className={classes.title}
                  >
                    {`${
                      section.posMarks
                    } will be awarded for each correct answer and`}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    className={classes.title}
                  >
                    {`${
                      section.negMarks
                    } will be awarded for each inCorrect answer`}
                  </Typography>
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
        <Fragment>
          <Typography variant="headline" gutterBottom className={classes.title}>
            {this.state.test.name}
          </Typography>
          <Typography
            variant="subheading"
            gutterBottom
            className={classes.title}
          >
            time: {this.state.test.time}
          </Typography>
          {sections}
          <Typography
            variant="subheading"
            gutterBottom
            className={classes.title}
          >
            sections: {this.state.test.sections.length}
          </Typography>
          <Typography
            variant="subheading"
            gutterBottom
            className={classes.title}
          >
            sections: {this.state.test.sections.length}
          </Typography>
          <Typography
            variant="subheading"
            gutterBottom
            className={classes.title}
          >
            sections: {this.state.test.sections.length}
          </Typography>
          <Typography
            variant="subheading"
            gutterBottom
            className={classes.title}
          >
            sections: {this.state.test.sections.length}
          </Typography>
        </Fragment>
      );
    }
    return cardContent;
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container="container">
          <ItemGrid xs={12} sm={12} md={12}>
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
