import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import classNames from 'classnames'
import UserCard from './user-card/UserCard'
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
import Grid from 'material-ui/Grid'
import LoginComponent from './login/LoginComponent'
import AccountCircle from 'material-ui-icons/AccountCircle'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import PublishingApp from './master-fs/PublishingApp'
import {BrowserRouter, Link, Route} from 'react-router-dom'
import Menu, {MenuItem} from 'material-ui/Menu'
import Header from './header/Header'
import Home from './home-component/Home'
import CreateTest from './create-test/CreateTest'
import ListTest from './list-test/ListTest'


const drawerWidth = 90
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  main: {
    position: 'absolute',
    top: 70,
    width: `calc(100% - ${drawerWidth + 10}px)`,
    left: 90,
    zIndex:2
  }
})

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loginState: null
    }
  }

  render() {
    const {classes, theme} = this.props
    return (<BrowserRouter>

      <Fragment>
        <main className={classes.main} >

          <Route path='/student/home/' exact render={() => (<Home/>)}/>
          <Route path='/student/home/createTest' exact render={() => (<CreateTest/>)}/>
          <Route path='/student/home/listTest' exact render={() => (<ListTest/>)}/>
          <Route path='/student/home/login' exact render={() => (<LoginComponent/>)}/>

        </main>
        <Header/>


      </Fragment>
    </BrowserRouter>)
  }
}

export default withStyles(styles, {withTheme: true})(Layout)
