import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ResultStyle from "../../variables/styles/ResultStyle.jsx";
import "../../variables/styles/Result.css";
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


class Result extends Component {

    state = {
        usernameVal: '',
        emailVal: '',
        passVal: '',

    };

    render() {
        return (
            <div>
                <img src={require("../../assets/img/banner-0१.jpg")} className="bannerImage" />
                <div className="container">
                    <h3 style={{ color: "#13b38b", textAlign: "center" }}>Free Test - CAT</h3>
                    <div className="gridMain">

                        <div>
                            <button style={{ float: "right" }} className="right divButton">SCORECARD</button>
                        </div>
                        <div>
                            <button style={{ float: "left" }} className="left divButton">BACK TO LOGIN</button>
                        </div>
                    </div>
                    <table style={{ width: "100%", margin: "0px auto" }}>

                        <tr className="mainHeadRow">
                            <th className="tableHead">SECTION TITLE</th>
                            <th className="tableHead">SCORE</th>
                            <th className="tableHead">PERCENTILE</th>
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
                <div className="footer">
                    <div className="footerLogo">

                    </div>
                    <div className="footerText">

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


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {},
        dispatch
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(ResultStyle)(Result)
);
