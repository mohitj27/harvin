import React from "react";
import PropTypes from "prop-types";
import logo from "../../assets/img/loginHosp.jpg";
import { withStyles, Grid } from "material-ui";
import Quiz from "../../components/Quiz/Quiz";
import { EditorState } from "draft-js";

import { RegularCard, ItemGrid } from "../../components";

import dashboardStyle from "../../variables/styles/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    return (
      <Quiz
        quizEditorState={EditorState.createEmpty()}
        height={500}
        width={500}
      />
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
