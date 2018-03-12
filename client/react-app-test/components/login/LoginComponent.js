import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card, {CardContent, CardMedia} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious'
import PlayArrowIcon from 'material-ui-icons/PlayArrow'
import SkipNextIcon from 'material-ui-icons/SkipNext'
import {Grid, Paper, TextField, Button} from 'material-ui'
import {FormControl, FormHelperText} from 'material-ui/Form'

const styles = theme => ({
  root:{
    flexGrow:1,
    margin:0,
    padding:0,

  },
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
  },
  cover: {
    width: 450,
    height: 450,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },

})

class LoginComponent extends Component {
  constructor(props){
    super(props)
    this.state={
      username:'',
      password:'',
    }
  }
  render() {
    const {classes, theme} = this.props

    return ( <div className={classes.root}>
      <Grid container justify="center" spacing={0}>

        <Card className={classes.card} elevation={20}>
          <Grid item xs={6}  hidden={{smDown:true}}>
            <CardMedia
              className={classes.cover}
              image="/img/card-main-background.png"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <div className={classes.details}>
              <CardContent className={classes.content} justify="center">
                <Grid container justify="center">
                  <Grid item xs={12} justify="center">
                    <Typography variant="display3">Harvin Login
                    </Typography>

                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="full-width" label="User Name" fullWidth value={this.state.username}  name="username" onChange={this.onChange}  margin="normal"/>


                  </Grid>
                  <Grid item xs={12}>
                    <TextField id="full-width" label="Password" fullWidth  value={this.state.username}  name="password" onChange={this.onChange}  margin="normal"/>


                  </Grid>
                </Grid>
              </CardContent>

            </div>

          </Grid>


        </Card>

      </Grid>

    </div>)
  }
}

LoginComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, {withTheme: true})(LoginComponent)
