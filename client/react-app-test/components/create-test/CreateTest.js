import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';
import {Grid, Paper,Typography,TextField} from 'material-ui'

const styles = theme => ({  root: {
    flexGrow: 1,
    marginTop:20
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
container:{
  height:'80%',
  width:'100%'
},
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

class CreateTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      testData: {}
    }
  }
  postNewTest() {}
  render() {
    const {classes} = this.props
    return (  <div className={classes.root}>
        <Paper className={classes.paper} elevation={15}>
          <form action="">
      <Grid container >
        <Grid item xs={12} >
          <Typography variant="display2">Create A test</Typography>
        </Grid>
        <Grid item xs={12}  >
          <TextField
                    id="full-width"
                    label="Label"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Placeholder"
                    helperText="Full width!"
                    fullWidth
                    margin="normal"
                  />        </Grid>
        </Grid>
        <Grid container>
        <Grid item xs={12} sm={6} >
          <Paper className={classes.paper}>sm12</Paper>
      </Grid>
      </Grid>
      </form>
    </Paper>
    </div>) } }
      CreateTest.propTypes = {classes: PropTypes.object.isRequired};
export default withStyles(styles)(CreateTest)
