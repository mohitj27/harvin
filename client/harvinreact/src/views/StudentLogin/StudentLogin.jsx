import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import StudentLoginStyles from "../../variables/styles/StudentLoginStyles";
import { loginSubmit } from "../../actions/studentAction";
// import logo from 


class StudentLogin extends Component {

    state = {
        usernameVal: '',
        emailVal: '',
        passVal: '',

    };

    // Handles change in Input fields
    handleChange = (e, name) => {
        console.log("e.target.value: ", e.target.value, '\n')
        if (name==="usernameVal") {
            this.setState({ usernameVal: e.target.value }, () => {
                console.log("usernameVal has value: ", this.state.usernameVal, '\n')
            });
        } else if (name==="emailVal") {
            this.setState({ emailVal: e.target.value }, () => {
                console.log("emailVal has value: ", this.state.emailVal, '\n')
            });
        } else if (name==="passVal") {
            this.setState({ passVal: e.target.value }, () => {
                console.log("passVal has value: ", this.state.passVal, '\n')
            });
        }
    }

    // Handles Form Submit
    handleSubmit = (e, name, email, pass) => {
        e.preventDefault();
        console.log('username: ', name, 'email: ', email, 'password: ', pass, '\n')
        if (name==="" || email==="" || pass==="") {
            alert("please fill in the fields!");
            document.getElementById('form').classList.add('form--no');
        }
        // Fire an action
        this.props.loginSubmit({ username: name, email: email, password: pass });

    }


    render() {

        const { classes } = this.props;

        return (
            <div className={classes.body}>
                <style>
                    <link href="https://fonts.googleapis.com/css?family=Bungee+Shade" rel="stylesheet" />

                </style>
                <div className={classes.user}>
                    <div className={classes.floatLeft} style={{float: "left"}}>
                        <img className={classes.image} src={require("../../assets/img/harvinLogo.png")} alt="Harvin Logo"/>
                    </div>

                    <div style={{float: "right"}}>
                        <header className={classes.user__header}>
                            <h1 className={classes.user__title}>Sign In</h1>
                        </header>
                        
                        <form id="form" className={classes.form}>
                            <div className={classes.form__group}>
                                <input type="text" placeholder="Username" value={this.state.usernameVal} onChange={(e) => this.handleChange(e, "usernameVal")} className={classes.form__input} required/>
                            </div>
                            
                            <div className={classes.form__group}>
                                <input type="email" placeholder="Email" value={this.state.emailVal} onChange={(e) => this.handleChange(e, "emailVal")} className={classes.form__input} required/>
                            </div>
                            
                            <div className={classes.form__group}>
                                <input type="password" placeholder="Password" value={this.state.passVal} onChange={(e) => this.handleChange(e, "passVal")} className={classes.form__input} required/>
                            </div>
                            
                            <button className={classes.btn} onClick={(e) => this.handleSubmit(e, this.state.usernameVal, this.state.emailVal, this.state.passVal)} type="button">Sign in</button>
                        </form>
                    </div>
                    
                </div>
            </div>
        );
    }






}


function mapStateToProps(state) {
    return {
      
    };
}


function mapDispatchToProps(dispatch) {
    return {
      loginSubmit,
    };
}

  
export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(StudentLoginStyles)(StudentLogin)
);
  