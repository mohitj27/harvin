import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ApplicantLoginStyles from "../../variables/styles/ApplicantLoginStyles";
import { loginSubmit } from "../../actions/applicantAction";
import { notifyClear } from '../../actions';
import {
    ErrorSnackbar,
    SuccessSnackbar,
    LoadingSnackbar
} from '../../components/GlobalSnackbar/GlobalSnackbar';
import {
    Redirect,
    withRouter
} from 'react-router-dom';
// import logo from 


class ApplicantLogin extends Component {

    state = {
        usernameVal: '',
        emailVal: '',
        passVal: '',

    };

    // Handles change in Input fields
    handleChange = (e, name) => {
        console.log("e.target.value: ", e.target.value, '\n')
        if (name === "usernameVal") {
            this.setState({ usernameVal: e.target.value }, () => {
                // console.log("usernameVal has value: ", this.state.usernameVal, '\n')
            });
        } else if (name === "emailVal") {
            this.setState({ emailVal: e.target.value }, () => {
                // console.log("emailVal has value: ", this.state.emailVal, '\n')
            });
        } else if (name === "passVal") {
            this.setState({ passVal: e.target.value }, () => {
                // console.log("passVal has value: ", this.state.passVal, '\n')
            });
        }
    }

    // Handles Form Submit
    handleSubmit = (e, email, pass) => {
        e.preventDefault();
        // Fire an action
        this.props.loginSubmit({ email: email, password: pass });

    }


    render() {

        const { classes } = this.props;
        let successSnackbar =
            this.props.successMessage !== '' ? (
                <SuccessSnackbar
                    successMessage={this.props.successMessage}
                    onClearToast={this.props.onClearToast}
                />
            ) : null;
        let errorSnackbar =
            this.props.errorMessage !== '' ? (
                <ErrorSnackbar
                    errorMessage={this.props.errorMessage}
                    onClearToast={this.props.onClearToast}
                />
            ) : null;
        let loadingSnackbar =
            this.props.notifyLoading !== '' ? <LoadingSnackbar /> : null;
        // if (this.props.isAuthenticated === true && window.localStorage.getItem('token')) {
        //   return <Redirect to="/HarvinQuiz" />;
        // }


        return (
            <div className={classes.body}>
                {successSnackbar}
                {errorSnackbar}
                {loadingSnackbar}

                <div className={classes.user} style={{ display: "inline-block", margin: "0px auto" }}>


                    <div style={{ float: "left" }}>
                        <header className={classes.user__header} style={{ display: "none" }}>
                            <h1 className={classes.user__title}>Sign In</h1>
                        </header>


                        <form id="form" className={classes.form}>
                            <div className={classes.floatLeft} style={{ float: "left" }}>
                                <img className={classes.image} src={require("../../assets/img/harvinLogo.png")} alt="Harvin Logo" />
                            </div>
                            {/* <div className={classes.form__group}>
                                <input type="text" placeholder="Username" value={this.state.usernameVal} onChange={(e) => this.handleChange(e, "usernameVal")} className={classes.form__input} required />
                            </div> */}

                            <div className={classes.form__group}>
                                <input type="username" placeholder="Email" value={this.state.emailVal} onChange={(e) => this.handleChange(e, "emailVal")} className={classes.form__input} style={{ fontSize: "20px" }} required />
                            </div>

                            <div className={classes.form__group}>
                                <input type="password" placeholder="Password" value={this.state.passVal} onChange={(e) => this.handleChange(e, "passVal")} className={classes.form__input} required />
                            </div>

                            <button className={classes.btn} onClick={(e) => this.handleSubmit(e, this.state.emailVal, this.state.passVal)} type="button" style={{ fontSize: "20px" }} >Sign in</button>
                        </form>
                    </div>

                </div>
            </div>
        );
    }






}


function mapStateToProps(state) {
    return {
        successMessage: state.notify.success,
        errorMessage: state.notify.error,
        notifyLoading: state.notify.loading,
        notifyClear: state.notify.clear,
    };
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { loginSubmit, onClearToast: () => dispatch(notifyClear()) },
        dispatch
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(ApplicantLoginStyles)(ApplicantLogin)
);
