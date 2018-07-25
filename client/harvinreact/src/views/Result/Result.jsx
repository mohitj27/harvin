import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ResultStyle from "../../variables/styles/ResultStyle.jsx";
// import "../../variables/styles/Result.css";
import { loginSubmit } from "../../actions/applicantAction";
import { notifyClear } from '../../actions';
import Radium, { StyleRoot } from 'radium';
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


class Result extends Component {

    state = {
        usernameVal: '',
        emailVal: '',
        passVal: '',

    };

    render() {
        const { classes } = this.props
        console.log(this.props.location)
        return (
            <StyleRoot>
                <div>
                    <img src={require("../../assets/img/Untitled-1-07.jpg")} className={classes.bannerImage} />
                    <div className={classes.container}>
                        <h3 style={{ color: "#13b38b", textAlign: "center" }}>Free Test - CAT</h3>
                        <div className={classes.gridMain}>

                            <div>
                                <button style={{ float: "right" }} className={classes.right}>SCORECARD</button>
                            </div>
                            <div>
                                <button style={{ float: "left" }} className={classes.left}>BACK TO LOGIN</button>
                            </div>
                        </div>
                        <table style={{ width: "100%", margin: "0px auto" }}>

                            <tr className={classes.mainHeadRow}>
                                <th className={classes.tableHead}>SECTION TITLE</th>
                                <th className={classes.tableHead}>SCORE</th>
                                <th className={classes.tableHead}>PERCENTILE</th>
                            </tr>
                            <tr>
                                <td>Verbal Ability</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                            <tr>
                                <td>Data Interpretation and Logical Resoning</td>
                                <td>Jackson</td>
                                <td>94</td>
                            </tr>
                            <tr>
                                <td>Quantative Ability</td>
                                <td>Jackson</td>
                                <td>94</td>
                            </tr>
                            <tr>
                                <td>Overall</td>
                                <td>Jackson</td>
                                <td>94</td>
                            </tr>
                        </table>

                    </div>
                    <div className={classes.footer}>
                        <div className={classes.footerLogo}>
                            <img className={classes.footerLogoImg} src={require("../../assets/img/socialMediaLogo/fb.png")} />
                            <img className={classes.footerLogoImg} src={require("../../assets/img/socialMediaLogo/twitter.png")} />
                            <img className={classes.footerLogoImg} src={require("../../assets/img/socialMediaLogo/instagram.png")} />

                        </div>
                        <div className={classes.footerTextHolder}>
                            <div className={classes.footerText}>
                                HOME
                        </div>
                            <div className={classes.footerText}>
                                MENU
                        </div>
                            <div className={classes.footerText}>
                                STORY
                        </div>

                        </div>
                    </div>
                </div>
            </StyleRoot>
        );
    }
}


function mapStateToProps(state) {
    return {

    };
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {},
        dispatch
    );
};


export default Radium(connect(mapStateToProps, mapDispatchToProps)(
    withStyles(ResultStyle)(Result)
));
