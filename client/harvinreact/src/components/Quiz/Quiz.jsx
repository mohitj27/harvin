//TODO SWATI REMOVE CARDS, LEFT ALIGN DETAIL AND REMOVE ACTIVATOR
import React, { Component, Fragment } from "react";
import {
  withStyles,
  Button,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress,
  Grid,
  Paper
} from "material-ui";
import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  Add
} from "material-ui-icons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import cx from "classnames";
import PropTypes from "prop-types";
import { RegularCard, ItemGrid } from "../";
import {
  ErrorSnackbar,
  LoadingSnackbar,
  SuccessSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import HtmlToReactParser from "html-to-react";
import quizStyles from "../../variables/styles/quizStyles";
import _ from "lodash";
import update from "immutability-helper";

class Quiz extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    questions: [],
    currentQuestion: "",
    currentOptions: [],
    answers: []
  };
  componentDidMount = () => {
    axios
      .get("http://localhost:3001/admin/questions")
      .then(res => {
        let questions = res.data.questions;
        let answers = [];
        if (questions.length <= 0) return;
        let currentOptions = questions[0].options || [];
        this.setState({
          questions: questions,
          currentQuestion: questions[0],
          currentOptions
        });
        // this.setState({ currentQuestion: questions[0] });
        questions.map((question, i) => {
          answers[i] = { _id: question._id, options: [] };
        });
        this.setState({ answers });
      })
      .catch(err => console.log("err", err));
  };
  handleQuizNavClick = e => {
    const curr = _.find(this.state.questions, function(o) {
      return o._id === e.target.id;
    });

    let currentOptions = curr.options || [];

    this.setState({ currentQuestion: curr, currentOptions });
  };
  handleChangeQuizOptionChange = e => {
    const answerObj = _.find(this.state.answers, o => {
      return o._id == this.state.currentQuestion._id;
    });
    const answerObjIndex = _.findIndex(this.state.answers, o => {
      return o._id == this.state.currentQuestion._id;
    });
    let foundVal = _.indexOf(answerObj.options, e.target.value);
    if (foundVal === -1) {
      answerObj.options.push(e.target.value);
    } else {
      _.remove(answerObj.options, obj => {
        if (obj === e.target.value) return obj === e.target.value;
      });
    }
    let newAnswers = [];
    this.state.answers.forEach((object, val) => {
      val === answerObjIndex
        ? newAnswers.push(answerObj)
        : newAnswers.push(object);
    });

    this.setState({ answers: newAnswers }, () => {
      this.getOptions();
    });
  };
  getOptions = () => {
    const value = [];
    let answerObj = null;

    if (typeof this.state.currentQuestion == "object") {
      answerObj = _.find(this.state.answers, o => {
        return o._id == this.state.currentQuestion._id;
      });
    }
    return this.state.currentOptions.map((option, i) => {
      let checked = false;
      try {
        // console.log("ano", answerObj.options[i], option.text);

        if (
          _.find(answerObj.options, optionObj => {
            return option.text == optionObj;
          })
        ) {
          checked = true;
        }
      } catch (err) {
        console.log(err);
      }
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={this.handleChangeQuizOptionChange}
                value={option.text}
              />
            }
            label={`${i + 1}) ${option.text}`}
          />
        </div>
      );
    });
  };
  getQuestionNavigationContent = classes => {
    return this.state.questions.map((question, i) => {
      return (
        <button
          id={question._id}
          value={question._id}
          key={question._id}
          aria-label="add"
          className={classes.quizNavButton}
          onClick={this.handleQuizNavClick}
        >
          {i + 1}
        </button>
      );
    });
  };
  getCardContent = () => {
    let htmlToReactParser = new HtmlToReactParser.Parser();
    let reactElement = htmlToReactParser.parse(
      this.state.currentQuestion.question
    );
    const opt = this.getOptions();
    return (
      <div>
        {reactElement}
        {opt}
      </div>
    );
  };
  render() {
    const { classes } = this.props;
    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;

    if (this.props.errorMessage && this.props.errorMessage !== "")
      errorSnackbar = (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      );

    if (this.props.successMessage && this.props.successMessage !== "")
      successSnackbar = (
        <SuccessSnackbar
          successMessage={this.props.succuessMessage}
          onClearToast={this.props.onClearToast}
        />
      );

    if (this.props.notifyLoading && this.props.notifyLoading !== "")
      processingSnackbar = (
        <LoadingSnackbar notifyLoading={this.props.notifyLoading !== ""} />
      );

    return (
      <Fragment>
        {errorSnackbar}
        {successSnackbar}
        {processingSnackbar}
        <Grid container="container">
          <ItemGrid xs={12} sm={8} md={8}>
            <RegularCard
              cardTitle="Selected Question"
              cardSubtitle=""
              headerColor="blue"
              content={this.getCardContent()}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={4} md={4}>
            <RegularCard
              cardTitle="Select any question to navigate"
              cardSubtitle=""
              headerColor="blue"
              content={this.getQuestionNavigationContent(classes)}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}
Quiz.PropTypes = {
  quiz: PropTypes.object.isRequired,
  quizEditorState: PropTypes.object.isRequired
};
function mapStateToProps(state) {
  return {};
}
function mappDispatchToProps(dispatch) {
  return;
  bindActionCreators({}, dispatch);
}

export default withStyles(quizStyles)(Quiz);
