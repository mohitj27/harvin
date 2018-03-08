import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import InboxIcon from 'material-ui-icons/Inbox'
import DraftsIcon from 'material-ui-icons/Drafts'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding:20
  },
})

class ListTest extends Component {
  render() {
    const {classes} = this.props
    return (<Paper className={classes.root} elevation={10}>
      <Typography variant="display2">
        List of Created Tests.
      </Typography>
      <List component="nav">
        <ListItem button="button">
          <ListItemIcon>
            <InboxIcon/>
          </ListItemIcon>
          <ListItemText primary="Inbox"/>
        </ListItem>
        <ListItem button="button">
          <ListItemIcon>
            <DraftsIcon/>
          </ListItemIcon>
          <ListItemText primary="Drafts"/>
        </ListItem>
      </List>
      <List component="nav">
        <ListItem button="button">
          <ListItemText primary="Trash"/>
        </ListItem>
        <ListItem button="button" component="a" href="#simple-list">
          <ListItemText primary="Spam"/>
        </ListItem>
      </List>
    </Paper>)
  }
}

ListTest.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListTest)
