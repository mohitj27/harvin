//TODO SWATI REMOVE CARDS, LEFT ALIGN DETAIL AND REMOVE ACTIVATOR


import React, { Component, Fragment } from 'react';
import {
  withStyles,
  Button,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  CircularProgress, Grid,
  Paper,
} from 'material-ui';
import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  SdStorage,
  Add,
} from 'material-ui-icons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { RegularCard, ItemGrid } from '../'
import { ErrorSnackbar, LoadingSnackbar, SuccessSnackbar } from "../../components/GlobalSnackbar/GlobalSnackbar";
import Editor from 'draft-js-plugins-editor';
import { EditorState } from 'draft-js';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css'
import createHighlightPlugin from '../draft-highlight-plugin/highlightPlugin';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import axios from 'axios'
import ReactDOMServer from 'react-dom/server'
import HtmlToReactParser from 'html-to-react';
import quizStyles from '../../variables/styles/quizStyles'
import _ from 'lodash'
import update from 'immutability-helper'




let options = ['ANSWER 1', 'ANSWER 2', 'ANSWER 3', 'ANSWER 4']
let questions = ['Question 1', 'Question 1', 'Question 1', 'Question 1', 'Question 1']
class Quiz extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    questions: questions,
    currentQuestion: '',
    answers: [],
  }
  componentDidMount = () => {
    axios
      .get("http://localhost:3001/admin/questions")
      .then(res => {
        let questions = res.data.questions;
        let answers = []
        if (questions.length <= 0) return;
        this.setState({ questions: questions });
        this.setState({ currentQuestion: questions[0] });
        questions.map((question, i) => {
          answers[i] = { _id: question._id, options: [] }
        })
        this.setState({ answers })
      })
      .catch(err => console.log("err", err));
  };
  handleQuizNavClick = (e) => {
    const curr = _.find(this.state.questions, function (o) {
      console.log('filter', o)
      return o._id === e.target.id;
    });
    console.log('curr', curr)
    this.setState({ currentQuestion: curr });
  }
  handleChangeQuizOptionChange = (e) => {
    

  }
  getOptions = () => {
    return (options.map((option) => {
      return (<div>
<FormControlLabel
        control={
          <Checkbox
          onChange={this.handleChangeQuizOptionChange}
        />
        }
        label={option}
      />

      </div>  
      
      )
    }))
  }
  getQuestionNavigationContent = (classes) => {
    return (this.state.questions.map((question, i) => {
      return (<Button variant="raised" id={question._id} value={question._id} key={question._id} aria-label="add" className={classes.quizNavButton} onClick={this.handleQuizNavClick}>
        {i + 1}
      </Button>)
    }))
  }
  getCardContent = () => {
    console.log('ques', this.state.currentQuestion)
    let htmlToReactParser = new HtmlToReactParser.Parser();
    let reactElement = htmlToReactParser.parse(this.state.currentQuestion.question);
    const opt = this.getOptions();
    return <div>
      {reactElement}
      {opt}
    </div>
  }
  render() {
    const { classes } = this.props;
    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;

    if (this.props.errorMessage && this.props.errorMessage !== '')
      errorSnackbar = <ErrorSnackbar errorMessage={this.props.errorMessage} onClearToast={this.props.onClearToast} />

    if (this.props.successMessage && this.props.successMessage !== '')
      successSnackbar = <SuccessSnackbar successMessage={this.props.succuessMessage} onClearToast={this.props.onClearToast} />

    if (this.props.notifyLoading && this.props.notifyLoading !== '')
      processingSnackbar = <LoadingSnackbar notifyLoading={this.props.notifyLoading !== ''} />

    return (<Fragment>
      {errorSnackbar}
      {successSnackbar}
      {processingSnackbar}
      <Grid container="container">
        <ItemGrid xs={12} sm={8} md={8}>
          <RegularCard cardTitle="Selected Question" cardSubtitle="" headerColor="blue" content={this.getCardContent()} />
        </ItemGrid>
        <ItemGrid xs={12} sm={4} md={4}>
          <RegularCard cardTitle="Select any question to navigate" cardSubtitle="" headerColor="blue" content={this.getQuestionNavigationContent(classes)} />
        </ItemGrid>
      </Grid>
    </Fragment>);
  }
}
Quiz.PropTypes = {
  quiz: PropTypes.object.isRequired,
  quizEditorState: PropTypes.object.isRequired,
}
function mapStateToProps(state) {
  return {

  }
}
function mappDispatchToProps(dispatch) {
  return
  bindActionCreators({}, dispatch)
}

export default withStyles(quizStyles)(Quiz)
