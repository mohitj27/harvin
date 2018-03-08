import React, {Component, Fragment} from 'react'
import UserCard from '../user-card/UserCard'
import Grid from 'material-ui/Grid'
import {withStyles} from 'material-ui/styles'

const styles={
  root:{
    flexGrow:1
  },
  paper:{
    textAlign: 'center',
    justifyContent:'center'
  },
  row:{
    justifyContent:'center'
  }
}
class Home extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return  (
      <Fragment>
        <Grid container>
          <Grid item xs={4}>
            <UserCard />
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}
export default withStyles(styles)(Home)
