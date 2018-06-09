import React from 'react';
import QuizNavbarStyles from '../../variables/styles/QuizNavbarStyles';
import logo from '../../assets/img/harvinLogo.png';

import { AppBar,
Toolbar,
IconButton,
Typography,
withStyles,
Button, } from 'material-ui';
import {
KeyboardArrowLeft
} from 'material-ui-icons';
class QuizNavbar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="title" color="grey" className={classes.flex}>
            <img src={logo} alt=""  className={classes.harvinLogo} />

          </Typography>
          <Typography variant="title"  className={`${classes.flex} ${classes.on3b}`}>
            Exam
          </Typography>
          <Typography variant="title"  className={`${classes.flex} ${classes.on3b}`}>
            Result
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
    );
  }
}
export default withStyles(QuizNavbarStyles)(QuizNavbar);
