import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Input, {InputLabel} from 'material-ui/Input'
import {FormControl, FormHelperText} from 'material-ui/Form'
import {Grid, Paper, Typography, TextField, Button} from 'material-ui'
import classNames from 'classnames'



const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  container: {
    height: '80%',
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  },
  submitButton: {
    color: 'white',
    background: '#93E192',
    background: '-webkit-linear-gradient(to left, #11cf9f, #93E192)',
    background: 'linear-gradient(-45deg, #11cf9f, #93E192)',

  },
  centerItems:{
    direction: 'row',
  justify: 'center',
  alignItems: 'center',
},
})

class CreateTest extends Component {
  constructor(props) {
    super(props)
    //this.onChange=this.onChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)
    this.state = {
    testName:''
    }
  }
  onSubmit(event){
    event.preventDefault()
    //this.props.createTestRequest(this.state)
  }
  onChange(event){
    this.setState({[event.target.name]:event.target.value})
  }
  render() {
    const {classes} = this.props
    return (<div className={classes.root}>
      <Paper className={classes.paper} elevation={15}>
        <form onSubmit={this.onSubmit}>
          <Grid container  justify="center">
            <Grid item xs={12}>
              <Typography variant="display2">Create A test</Typography>
            </Grid>
            <Grid item xs={6} >
              <TextField id="full-width" label="Test Name" value={this.state.testName}  name="testName" onChange={this.onChange} fullWidth margin="normal"/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="full-width" label="Label" placeholder="Placeholder" helperText="Full width!" fullWidth margin="normal"/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="full-width" label="Label" placeholder="Placeholder" helperText="Full width!" fullWidth margin="normal"/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="full-width" label="Label" placeholder="Placeholder" helperText="Full width!" fullWidth margin="normal"/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="full-width" label="Label" placeholder="Placeholder" helperText="Full width!" fullWidth margin="normal"/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sm={12}>
              <Button type="submit" className={classes.submitButton}>Submit</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>)
  }
}
CreateTest.propTypes = {
  classes: PropTypes.object.isRequired,
  createTestRequest:PropTypes.func.isRequired
}
export default withStyles(styles)(CreateTest)
