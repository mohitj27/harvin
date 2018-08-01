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

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("getDerivedStateFromProps is working fine");
    }


    returnTableBody = () => {


        console.log(this.props.result, "this.props.result.res.sections")
        console.log(this.props.location);
        console.log("this.props.router", this.props.router);
        console.log("this.props", this.props);
        let Sections = "";
        let TableRows = "";
        let Overall = <tr>
            <td>Overall</td>
            <td>{"marksAchieved"}</td>
            <td>{"(marksAchieved / totalMarks) * 100"}</td>
        </tr>
        if (this.props.result.res === undefined) {
            // return <Redirect to="/HarvinQuiz/Tests" />
            return;
            // Sections = []
        }

        Sections = this.props.result.res.sections;
        let marksAchieved = Sections.reduce((prev, curr) => (+prev.marks) + (+curr.marks));
        let totalMarks = Sections.reduce((prev, curr) => ((+prev.nUnAnsweredQues) + (+prev.nAnsweredQues)) * (+prev.posMark) + ((+curr.nUnAnsweredQues) + (+curr.nAnsweredQues)) * (+curr.posMark));


        console.log("Sections--------------------------------", Sections);
        TableRows = (
            <table style={{ width: "100%", margin: "0px auto" }}>

                <tr className={this.props.classes.mainHeadRow}>
                    <th className={this.props.classes.tableHead}>SECTION TITLE</th>
                    <th className={this.props.classes.tableHead}>SCORE</th>
                    <th className={this.props.classes.tableHead}>PERCENTILE</th>
                </tr>
                {

                    Sections.map((sec, index) =>
                        (<tr key={index}>
                            <td className={this.props.classes.centerContent}>{sec.section_name}</td>
                            <td className={this.props.classes.centerContent}>{sec.marks}</td>
                            {/* <td className={this.props.classes.centerContent}>{((+sec.marks) / (((+sec.nUnAnsweredQues + (+sec.nAnsweredQues)) * (+sec.posMark)))) * 100 + "%"}</td> */}
                            <td className={this.props.classes.centerContent}>{(((sec.marks / (((+sec.nAnsweredQues) + (+sec.nUnAnsweredQues)) * (+sec.posMark))) * 100) + "").substring(0, 5) + "%"}</td>
                        </tr>))}
                <tr>
                    <td className={this.props.classes.centerContent}>Overall</td>
                    <td className={this.props.classes.centerContent}>{marksAchieved}</td>
                    <td className={this.props.classes.centerContent}>{((marksAchieved / totalMarks * 100) + "").substring(0, 5) + "%"}</td>
                    {/* <td className={this.props.classes.centerContent}>{(marksAchieved / totalMarks) * 100}</td> */}
                </tr>
            </table>
        );
        console.log("TableRowsTableRowsTableRowsTableRowsTableRows", TableRows);


        return TableRows;



    }

    render() {
        const { classes } = this.props
        console.log("this.returnTableBody()", this.returnTableBody())
        return (
            <StyleRoot>
                <div>
                    <img src={require("../../assets/img/Untitled-1-07.jpg")} className={classes.bannerImage} />
                    <div className={classes.container}>
                        <h3 style={{ color: "#13b38b", textAlign: "center" }}>Free Test - CAT</h3>
                        <div className={classes.gridMain}>

                            <div>
                                <button style={{ float: "right" }} className={classes.buttonS}>SCORECARD</button>
                            </div>
                            <div>
                                <button style={{ float: "left" }} className={classes.buttonS}>BACK TO LOGIN</button>
                            </div>
                        </div>

                        {this.returnTableBody()}

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
        result: state.result.result
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
