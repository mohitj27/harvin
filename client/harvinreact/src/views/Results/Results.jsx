import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import resultStyle from "../../variables/styles/resultStyle";
import { getAllQuestions ,deleteQuesAction ,getAllResult } from "../../actions";

import * as actions from "../../actions";
import classnames from "classnames";
import { connect } from "react-redux";

import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import { ExpandMore ,Edit ,Delete} from "material-ui-icons";
import HtmlToReact from "html-to-react";
import {
  Button,
  Grid,
  Icon,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
  Typography,
  Checkbox,
  IconButton
} from "material-ui";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import { RegularCard, ItemGrid } from "../../components";
import ProgressBar from '../../components/ProgressBar/ProgessBar';


const HtmlToReactParser = HtmlToReact.Parser;

class Result extends Component {
  state = {
    questions: null,
    loading: false,
    success: false
  };
  

  getCardContent() {
    let { classes } = this.props;
    let errorSnackbar =
      this.props.errorMessage !== "" ? (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;

    let content = null;
    if (!this.props.isFetchingAllQuestionsInProgress) {
      if (this.state.questions.length > 0) {
        content = this.state.questions.map((ques, i) => {
          let htmlToReactParser = new HtmlToReactParser();
          let reactElement = htmlToReactParser.parse(ques.question);
          return (
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography style={{ alignSelf: "center", marginRight: "5px" }}>
                    Q.{i + 1}
                  </Typography>{" "}
                  {reactElement}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid style={{ display: "flex", flexWrap: "wrap",float:"left" }}>
                    {this.getPrevQuesOptions(ques.options)}
                  </Grid>
                </ExpansionPanelDetails>
                  <div style={{marginLeft:"0px auto",textAlign:"center"}}>
                    You Answered : { "Answer 1" }<br/>
                  </div>
                <ExpansionPanelDetails>
                </ExpansionPanelDetails>
              </ExpansionPanel>
          )        });
      } else {
        content = (
          <Grid
            style={{ display: "flex" ,float:"left"}}
            justify="center"
            className={classes.loading}
          >
            <h4>You haven't added any question yet !!!</h4>
          </Grid>
        );
      }
    } else {
      content = (
        <Grid
          style={{ display: "flex" }}
          justify="center"
          className={classes.loading}
        >
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <Fragment>
        {errorSnackbar}
        <div className={classes.centerAlign}>
          <span className={classes.spanResult}>Marks Obtained:19/20</span>
          <span className={classes.spanResult}>Number of Question selected:3/4</span>
          <span className={classes.spanResult}>Total Right Answers:4</span>
          <span className={classes.spanResult}>Total Wrong Answers:1</span>
          <br/>
        </div>

        {content}
      </Fragment>
    );
  }

  componentDidMount() {
    this.props.getAllResult();
    this.props.onQuestionsFetch();
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {

    if (
      !nextProps.isFetchingAllQuestionsInProgress &&
      nextProps.questions.length >= 0
    ) {
      return {
        questions: nextProps.questions
      };
    }
    if(!nextProps.isQuestionDeleteInProgress && nextProps.notifySuccess === 'Question Deleted Successfully.'  ){
      return {
        questions: nextProps.questions
      }
    }
    return null;
  };

  getPrevQuesOptions = opts => {
    const options = opts || [];
    let htmlToReactParser = new HtmlToReactParser();

    return options.map((opt, i) => {
      let reactElement = htmlToReactParser.parse(opt.text);

      return (
        <Fragment>
          <Checkbox
            checked={opt.isAns}
            value={`${opt.text}`}
            disabled={true}
            color="primary"
          />

          {reactElement}
        </Fragment>
      );
    });
  };

  render() { 
    let successSnackbar =
      this.props.successMessage !== "" ? (
        <SuccessSnackbar
          successMessage={this.props.successMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let errorSnackbar =
      this.props.errorMessage !== "" ? (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let loadingSnackbar =
      this.props.notifyLoading !== "" ? <LoadingSnackbar /> : null;
    return (
      <Fragment>
        <Grid container="container">
          <ItemGrid xs={12}>

            <RegularCard
              style={{textAlign:"center"}}
              cardTitle="Result"
              cardSubtitle={this.getSubtitle}
              headerColor="blue"
              content={this.getCardContent()}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onQuestionsFetch: () => dispatch(actions.getAllQuestions()),
    onQuestionDelete:(obj)=>dispatch(actions.deleteQuesAction(obj)),
    getAllResult:()=>dispatch(actions.getAllResult())
  };
}

function mapStateToProps(state) {
  return {
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
    questions: state.questions.allQuestions,
    isFetchingAllQuestionsInProgress:
    state.questions.isFetchingAllQuestionsInProgress
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(resultStyle)(Result)
);
