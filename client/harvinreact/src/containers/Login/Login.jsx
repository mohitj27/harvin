import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loginAction } from '../../actions'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import loginStyles from '../../variables/styles/loginStyles'
import { Grid, Paper, withStyles, Button } from 'material-ui'
import logo from '../../assets/img/harvinLogo.png'
const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true
        setTimeout(cb, 100)
    },
    signout(cb) {
        this.isAuthenticated = false
        setTimeout(cb, 100)
    }
}


const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
    state = {
        redirectToReferrer: false
    }
    login = (e) => {
        e.preventDefault();
        fakeAuth.authenticate(() => {
            this.setState(() => ({
                redirectToReferrer: true
            }))
        })
    }
    render() {
        const { redirectToReferrer } = this.state
        const { classes } = this.props

        if (redirectToReferrer === true) {
            return (<Redirect to='/dashboard' />)
        }

        return (
            <div className={classes.root} >
                <Paper >
                    <Grid container  className={classes.centerContainer}>
                        <Grid item xs={6} className={classes.centerContainer}>
                            <img src={logo} alt="harvin logo" style={{ height: '50px' }} />
                        </Grid>
                        <Grid item xs={6} >
                            <Grid container >
                                <Grid item xs={12} className={classes.centerContainer}>
                                    <input type="text" />
                                </Grid>
                                <Grid item xs={12} className={classes.centerContainer}>
                                    <input type="password" />
                                </Grid>
                                <Grid item xs={12} className={classes.centerContainer}>
                                    <Button variant="raised" onClick={this.login} className={classes.raisedButton}>Log in</Button>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {}
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loginAction }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(loginStyles)(Login)))