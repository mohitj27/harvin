import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import InboxIcon from 'material-ui-icons/Inbox'
import DraftsIcon from 'material-ui-icons/Drafts'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import axios from 'axios'
import { CircularProgress } from 'material-ui/Progress'


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding:20,

  },
})

class ListTest extends Component {
  constructor(props){
    super(props)
    this.state={
      testList:null
    }
  }
  getListOfTests(){
    console.log('getTests')
  axios.get('https://harvin.academy/admin/exams/user402/exams').then((res)=>{
    console.log(res)
    this.setState({'testList':res.data.exams})
  })
  }
  getListElements(){
    const listItems = this.state.testList.map((item) =>
  {console.log('item', item)
    return <a href={`https://harvin.academy/quiz/exams/${item._id}/questionPaper`}>
      <ListItem button key={item._id} >
        <ListItemText primary={item.examName}/>
      </ListItem>
    </a>}
     )
     return listItems
  }

  componentDidMount(){this.getListOfTests()}
  render() {

    const {classes} = this.props
    const {state}=this.state
    if(!this.state.testList)
    return (
    <Grid container justify="center">
      <Grid item >
          <CircularProgress className={classes.progress} />
      </Grid>
    </Grid>
    )
    return (
<Grid container justify="center">
  <Grid item >
    <Paper className={classes.root} elevation={10}>
      <Typography variant="display2">
        List of Created Tests.
      </Typography>
      <List component="nav">
      {this.getListElements()}
      </List>
    </Paper>
  </Grid>
</Grid>

    )
  }
}

ListTest.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListTest)
