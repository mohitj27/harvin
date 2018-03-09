import React,{Component,Fragment} from 'react'
import {Avatar,Paper,Typography,Button} from 'material-ui'
import {withStyles} from 'material-ui/styles'
import PropTypes from 'prop-types'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';


const styles = {

  root: {
    flexGrow:1,
    display: 'flex',
    justifyContent: 'center',
    padding:10,

  },
}
const UserCard= props=>{
  const {classes}=props
  return(
<Card className={classes.root}>


          <Avatar className={classes.avatar}>
            IS
          </Avatar>
          <Typography variant="display1" >
            Lizard
          </Typography>
        <Button href="/student/login" >Logout</Button>

</Card>)

}
UserCard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default  withStyles(styles)(UserCard)
