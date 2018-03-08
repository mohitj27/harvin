import React,{Component,Fragment} from 'react'
import {Avatar,Paper,Typography,Button} from 'material-ui'
import {withStyles} from 'material-ui/styles'
import PropTypes from 'prop-types'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';


const styles = {

  row: {
    display: 'flex',
    justifyContent: 'center',
  },
}
const UserCard= props=>{
  const {classes}=props
  return(
<Fragment>

  <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Avatar className={classes.avatar}>
            IS
          </Avatar>
          <Typography variant="display2" >
            Lizard
          </Typography>
          <Typography component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species,this is a BIO
          </Typography>
        </CardContent>

      </Card>

</Fragment>)

}
UserCard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default  withStyles(styles)(UserCard)
