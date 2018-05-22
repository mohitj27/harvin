import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import questionsStyle from "../../variables/styles/questionsStyle";
import { getAllQuestions } from "../../actions";

import classnames from "classnames";
import { connect } from "react-redux";

import {} from "material-ui-icons";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { RegularCard, ItemGrid } from "../../components";
class Questions extends Component {
  getCardContent() {
    return <div />;
  }

  componentDidMount() {}

  render() {
    return (
      <Fragment>
        <Grid container="container">
          <ItemGrid xs={12}>
            <RegularCard
              cardTitle="Add Questions"
              cardSubtitle="List of all the questions added by you"
              headerColor="blueGrey"
              content={this.getCardContent()}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(questionsStyle)(Questions)
);
