import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List , { ListItem, ListItemIcon, ListItemText }from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import {Face,LibraryBooks} from 'material-ui-icons'
import CreateTestIcon from 'material-ui-icons/Create'
import TrashIcon from 'material-ui-icons/Delete'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import PublishingApp from './master-fs/PublishingApp'
import Home from './home-component/Home'
import CreateTest from './create-test/CreateTest'
import ListTest from './list-test/ListTest'
import {BrowserRouter,Link,Route} from 'react-router-dom'




const drawerWidth = 240
const mainStyle={
  marginTop: '40px',
}
const styles = theme => ({

  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },

  appBar: {

    zIndex: theme.zIndex.drawer +1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
})

class Layout extends React.Component {
  constructor(props){
super(props)
    this.state = {
      open: false,
    }
this.handleDrawerOpen=this.handleDrawerOpen.bind(this)
this.handleDrawerClose=this.handleDrawerClose.bind(this)
  }
  handleDrawerOpen () {
    this.setState({ open: true })
  }

  handleDrawerClose () {
    this.setState({ open: false })
  }

  render() {
    const { classes, theme } = this.props

    return (
      <BrowserRouter>
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Harvin Academy
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
            <List component="nav">
              <Link to='/student/home/'>
          <ListItem button>
            <ListItemIcon>
              <Face />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </Link>
          <Link to='/student/home/createTest'>
          <ListItem button>
            <ListItemIcon>
              <CreateTestIcon />
            </ListItemIcon>
            <ListItemText primary="Create Test" />
          </ListItem>
        </Link>
          <Link to='/student/home/listTest'>
          <ListItem button>
            <ListItemIcon>
              <LibraryBooks />
            </ListItemIcon>
            <ListItemText primary="Take Tests" />
          </ListItem>
        </Link>
<Link to='/student/home/performance'>
          <ListItem button  className="appBarBottomIcons">
            <ListItemIcon>
              <TrashIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItem>
          </Link>

        </List>
        <Divider/>
          <List>{}</List>
        </Drawer>
        <main style={mainStyle}className={classes.content}>
          <div className={classes.toolbar} />

  {  /*    <PublishingApp className={classes.PublishingApp}></PublishingApp>*/}
          <Route path='/student/home/'  exact render={()=>(<Home/>)}/>
          <Route path='/student/home/createTest'  render={()=>(<CreateTest/>)}/>
          <Route path='/student/home/listTest' exact render={()=>(<ListTest/>)}/>




        </main>
      </div>
    </BrowserRouter>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Layout)
