import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import classNames from 'classnames'
import UserCard from '../user-card/UserCard'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import {LibraryBooks} from 'material-ui-icons'
import HomeIcon from 'material-ui-icons/Home'
import CreateTestIcon from 'material-ui-icons/Create'
import TrashIcon from 'material-ui-icons/Delete'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import AccountCircle from 'material-ui-icons/AccountCircle';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import {BrowserRouter, Link, Route} from 'react-router-dom'
import Menu, {MenuItem} from 'material-ui/Menu'
import { CircularProgress } from 'material-ui/Progress'


const drawerWidth = 240
const mainStyle = {
  backgroundColor:'#f7f7f7',
  width:'100%',
  padding:'0 20px 20px 20px'
}
const styles = theme => ({

  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',

  },
  flex: {
    flex: 1
  },
  accountCircle:{
    position:'absolute',
    right:'5%',
    top:'10%'
  },
  appBar: {
    background: '#93E192',
    background: '-webkit-linear-gradient(to left, #11cf9f, #93E192)',
    background: 'linear-gradient(-45deg, #11cf9f, #93E192)',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create([
      'width', 'margin'
    ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    height: 56
  },
  appBarShift: {
    zIndex:100,
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create([
      'width', 'margin'
    ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    zIndex:100,
    position: 'relative',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    height: 56
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  divider:{
    marginTop:0,
    marginBottom:0
  }
})
class Header extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      anchorEl: null,
      loginState:null,
    }
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this)
    this.handleDrawerClose = this.handleDrawerClose.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
  }
  handleDrawerOpen() {
    this.setState({open: true})
  }

  handleDrawerClose() {
    this.setState({open: false})
  }
  handleMenu(event) {
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose() {
    this.setState({anchorEl: null})
  }
  render(){
    const {classes, theme} = this.props
    const {auth, anchorEl} = this.state;
    const open = Boolean(anchorEl);
    return(<div className={classes.root}>
      <AppBar position="absolute" className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
        <Toolbar disableGutters={!this.state.open} className={classNames(classes.toolbar)}>
          <IconButton color="inherit" aria-label="open drawer" onClick={this.handleDrawerOpen} className={classNames(classes.menuButton, this.state.open && classes.hide)}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="title" className="flex" color="inherit" noWrap>
            Harvin Academy
          </Typography>
          <Fragment>
            <div>
              <IconButton aria-owns={open
                  ? 'menu-appbar'
                  : null} aria-haspopup="true" onClick={this.handleMenu} color="inherit" className={classNames(classes.accountCircle)}>
                <AccountCircle />
              </IconButton>
              <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }} transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }} open={open} onClose={this.handleClose}>
                  <UserCard
                    />
              </Menu>

            </div>
          </Fragment>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" classes={{
          paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose)
        }} open={this.state.open}>
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            {
              theme.direction === 'rtl'
                ? <ChevronRightIcon/>
                : <ChevronLeftIcon/>
            }
          </IconButton>
        </div>
        <List component="nav">
          <Link to='/student/home/'>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon/>
              </ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItem>
          </Link>
          <Link to='/student/home/createTest'>
            <ListItem button>
              <ListItemIcon>
                <CreateTestIcon/>
              </ListItemIcon>
              <ListItemText primary="Create Test"/>
            </ListItem>
          </Link>
          <Link to='/student/home/listTest'>
            <ListItem button>
              <ListItemIcon>
                <LibraryBooks/>
              </ListItemIcon>
              <ListItemText primary="Take Tests"/>
            </ListItem>
          </Link>
          <Link to='/student/home/login'>
            <ListItem button className="appBarBottomIcons">
              <ListItemIcon>
                <TrashIcon/>
              </ListItemIcon>
              <ListItemText primary="Delete"/>
            </ListItem>
          </Link>

        </List>
        <List>{}</List>
      </Drawer>


      </div>)
  }
}
export default withStyles(styles, {withTheme: true})(Header)
