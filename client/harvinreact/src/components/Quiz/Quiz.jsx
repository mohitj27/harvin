//TODO SWATI REMOVE CARDS, LEFT ALIGN DETAIL AND REMOVE ACTIVATOR
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Radium, { StyleRoot } from 'radium'; // Radium for using media Queries check: (https://formidable.com/open-source/radium/)
import {
  withStyles,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Badge,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  ExpansionPanel,
  Card,
} from 'material-ui';
import SnackBar from '@material-ui/core/Snackbar';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowDown
} from 'material-ui-icons';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { RegularCard, ItemGrid } from '../';
import {
  ErrorSnackbar,
  LoadingSnackbar,
  SuccessSnackbar
} from '../../components/GlobalSnackbar/GlobalSnackbar';
import QuizNavbar from '../../components/QuizNavbar/QuizNavbar';
import axios from 'axios';
import HtmlToReact from 'html-to-react';
import quizStyles from '../../variables/styles/quizStyles';
import update from 'immutability-helper';
import _ from 'lodash';
import url from './../../config';
import * as actions from "../../actions";
const HtmlToReactParser = HtmlToReact.Parser;


class Quiz extends Component {
  state = {
    questions: [],
    currentQuestion: '',
    currentOptions: [],
    expandedSection: '',
    answers: [],
    test: 'test',
    lastQuestionOpened: '',
    time: '',
  };
  constructor(props) {
    super(props);
    const interval = setInterval(() => {
      try {
        this.setState({ time: this.state.time - 1 });
        if (this.state.time <= 0) {
          clearInterval(interval);
          this.setState({ testFinished: true });
        }
      } catch (e) {
        console.log('err', e);
      }
    }, 1000);
  }

  componentDidMount = () => { };

  handleQuizNavClick = (e, questions) => {
    const curr = _.find(questions, function (o) {
      return o._id === e.target.id;
    });

    let currentOptions = curr.options || [];
    this.setState({
      currentQuestion: curr,
      currentOptions,
      lastQuestionOpened: curr._id,
    });
  };

  handlePanelExpansion = (e, id) => {
    e.stopPropagation();
    let questionToOpen;

    //TODO LAST QUESTION OPENED SHOULD BE OPENED ON SECTION CHANGE
    // questionToOpen=_.find(_.find(this.state.test.sections,(section)=>{
    //   return section._id===this.state.expandedSection
    // }),(question)=>{
    //   return question._id===this.state.lastQuestionOpened
    // })
    const sectionOpened = _.find(this.state.test.sections, section => {
      return section._id === id;
    });
    const curr = sectionOpened.questions[0];
    let currentOptions = curr.options || [];
    questionToOpen = sectionOpened.questions[0];

    // if (id === this.state.expandedSection)
    // this.setState({ expandedSection: -1 });
    this.setState({
      expandedSection: id,
      currentOptions,
      questions: sectionOpened.questions,
      currentQuestion: questionToOpen,
    });
  };

  handleChangeQuizOptionChange = e => {
    const sectionAnswers = this.state.sectionAnswers;
    const sectionAnswer = _.find(this.state.sectionAnswers, secObj => {
      return secObj._id === this.state.expandedSection;
    });
    const sectionAnswerIndex = _.findIndex(
      this.state.sectionAnswers,
      secObj => {
        return secObj._id === this.state.expandedSection;
      }
    );
    const newSectionAnswer = _.cloneDeep(sectionAnswer);

    const answerObj = _.find(newSectionAnswer.answer, (o, i) => {
      return o._id === this.state.currentQuestion._id;
    });

    const answerObjIndex = _.findIndex(newSectionAnswer.answer, o => {
      return o._id === this.state.currentQuestion._id;
    });

    let foundVal = _.indexOf(answerObj.options, e.target.id);
    if (foundVal === -1) {
      answerObj.options.push(e.target.id);
    } else {
      _.remove(answerObj.options, obj => {
        return obj === e.target.id;
      });
    }

    const newSectionAnswers = update(sectionAnswers, {
      [sectionAnswerIndex]: {
        answer: { [answerObjIndex]: { $set: answerObj } },
      },
    });

    this.setState({ sectionAnswers: newSectionAnswers });
  };

  getOptions = () => {
    let answerObj = null;
    try {
      if (typeof this.state.currentQuestion == 'object') {
        const sectionAnswer = _.find(this.state.sectionAnswers, secObj => {
          return secObj._id === this.state.expandedSection;
        });
        answerObj = _.find(sectionAnswer.answer, o => {
          return o._id === this.state.currentQuestion._id;
        });
        const answerObjIndex = _.findIndex(sectionAnswer.answer, o => {
          return o._id === this.state.currentQuestion._id;
        });
      }

      return this.state.currentOptions.map((option, i) => {
        let checked = false;
        try {
          if (
            _.find(answerObj.options, optionObj => {
              return option._id === optionObj;
            })
          ) {
            checked = true;
          }
        } catch (err) {
          console.log(err);
        }

        let htmlToReactParser = new HtmlToReactParser();
        let reactElement = htmlToReactParser.parse(option.text);
        return (
          <div>
            <Checkbox
              checked={checked}
              onChange={this.handleChangeQuizOptionChange}
              value={option.text}
              id={option._id}
            />

            {reactElement}
          </div>
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  onSubmit = e => {
    e.preventDefault();
    console.log('asd')
    let formData = new FormData();
    formData.append('maxMarks', this.state.test.maxMarks);
    formData.append('testId', this.state.test._id);
    formData.append('answers', JSON.stringify(this.state.sectionAnswers));
    let localUrl = `${url}/admin/answers/${this.state.test._id}`;
    this.props.onSubmitResult(localUrl, formData)
    // axios
    //   .post(`${url}/admin/answers/${this.state.test._id}`, formData)
    //   .then(res => {
    //     console.log(res)
    //     alert(`You have scored ${res.data.marks}`);
    //     this.props.history.push({
    //       pathname: '/other-page',
    //       state: res.data
    //     })
    //     // window.location.href = ('/HarvinQuiz/applicant/result/?marks=' + res.data.marks);

    //   })
    //   .catch(err => console.log('err', err));
  };

  getSectionNavigationContent = classes => {
    if (!this.state.test.sections) return;
    return (
      <div>
        {this.state.test.sections.map(section => {
          return (
            <ExpansionPanel
              expanded={section._id === this.state.expandedSection}
              onChange={e => {
                this.handlePanelExpansion(e, section._id);
              }}
            >
              <ExpansionPanelSummary expandIcon={<KeyboardArrowDown />}>
                <Typography className={classes.heading}>
                  {section.title}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
                {this.getQuestionNavigationContent(classes, section.questions)}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  };

  getQuestionNavigationContent = (classes, questions) => {
    if (!questions) return <div />;

    // find the currentSection from sectionAnswers array
    const currentSection = _.find(
      this.state.sectionAnswers,
      section => this.state.expandedSection == section._id
    );
    if (!currentSection) return <div />;
    // console.log("gopCurrSec", currentSection._id, currentSection);

    // currentQues Style
    let selectedQuesStyle;

    // doneQues style
    let doneStyle;

    // review style
    let badge;

    // current section questions
    const currentSectionQuestions = this.state.questions;

    // for each question in current section
    return currentSection.answer.map((ans, i) => {
      // applying selectedQuesStyle
      if (this.state.currentQuestion._id == ans._id)
        selectedQuesStyle = `${classes.selectedQuestion}`;
      else selectedQuesStyle = ``;

      // applying doneStyle
      if (ans.options.length > 0) doneStyle = `${classes.qStatus}`;
      else doneStyle = ``;

      // apppling badge style
      if (currentSectionQuestions[i].markForLater)
        badge = (
          <Badge
            badgeContent="!"
            className={`${classes.badge}`}
            color="primary"
          />
        );
      else badge = ``;

      return (
        <Fragment>
          <button
            id={ans._id}
            value={ans._id}
            key={ans._id}
            aria-label="add"
            className={`${
              classes.quizNavButton
              } ${selectedQuesStyle} ${doneStyle}`}
            onClick={val => {
              this.handleQuizNavClick(val, questions);
            }}
          >
            {i + 1}
            {badge}
          </button>
        </Fragment>
      );
    });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.test) {
      console.log('nextProp', nextProps);
      //Section Answer Created Here
      const answerObj = nextProps.test.sections.map((section, i) => {
        const innObj = section.questions.map(question => {
          return { _id: question._id, options: [] };
        });
        return { _id: section._id, answer: innObj, posMarks: section.posMarks, negMarks: section.negMarks, };
      });
      return {
        test: nextProps.test,
        questions: nextProps.test.sections[0].questions,
        sectionAnswers: answerObj,
        expandedSection: nextProps.test.sections[0]._id,
        currentQuestion: nextProps.test.sections[0].questions[0],
        currentOptions: nextProps.test.sections[0].questions[0].options,
        time: parseInt(nextProps.test.time) * 60,
      };
    }

    return {};
  };

  handleMarkForLater = event => {
    const currentQuestionState = this.state.currentQuestion;
    currentQuestionState.markForLater = event.target.checked;
    this.setState({ currentQuestion: currentQuestionState });
  };



  getTestTitle = (testName, classes) => {
    const min = Math.floor(this.state.time / 60); //time remaning in minutes
    const sec = this.state.time % 60;  //time remaning in seconds
    return (
      <div className={classes.testHeader}>
        <Typography className={classes.testName} variant="display2" >
          {testName}
        </Typography>
        <div className={classes.testControls} >
          <Typography variant="display2" className={classes.clock} >
            {min}:{sec}
          </Typography>
          <Button
            variant="raised"
            color="primary"
            onClick={this.onSubmit}
            style={{ margin: 16 }}
            className={classes.submitButton}
          >
            submit
          </Button>
        </div>


      </div>
    );
  };


  handleArrowPrev = e => {
    let currentIndex = _.findIndex(this.state.questions, question => {
      return question._id === this.state.currentQuestion._id;
    });
    if (currentIndex <= 0) return;

    currentIndex--;

    this.setState({
      currentQuestion: this.state.questions[currentIndex],
      currentOptions: this.state.questions[currentIndex].options,
    });
  };

  handleArrowNext = e => {
    let currentIndex = _.findIndex(this.state.questions, question => {
      return question._id === this.state.currentQuestion._id;
    });

    if (currentIndex === this.state.questions.length - 1) return;

    currentIndex++;
    this.setState({
      currentQuestion: this.state.questions[currentIndex],
      currentOptions: this.state.questions[currentIndex].options,
    });
  };

  getCardContent = classes => {
    let markForLater = null;
    if (this.state.currentQuestion !== '') {
      markForLater = (
        <FormControlLabel
          className={classes.markForLater}
          control={
            <Checkbox
              value="markForLater"
              color="primary"
              onChange={this.handleMarkForLater}
              checked={this.state.currentQuestion.markForLater || false}
            />
          }
          label="Mark for later"
        />
      );
    }

    let htmlToReactParser = new HtmlToReactParser();
    let reactElement = htmlToReactParser.parse(
      this.state.currentQuestion.question
    );
    const opt = this.getOptions(classes);
    return (<div>
      {markForLater}
      <Card style={{ padding: '20px', }}>

        {reactElement}
        {opt}
      </Card>

    </div>
    );
  };

  render() {
    const { classes } = this.props;
    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;
    let finishTestSnackBar = null;
    if (this.props.errorMessage && this.props.errorMessage !== '')
      errorSnackbar = (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      );

    if (this.state.testFinished === true) {
      this.onSubmit({ preventDefault: () => { } });
      finishTestSnackBar = (<SnackBar
        message="Test Finished!"
        open={this.state.testFinished}
      />);
    }

    if (this.props.successMessage && this.props.successMessage !== '')
      successSnackbar = (
        <SuccessSnackbar
          successMessage={this.props.succuessMessage}
          onClearToast={this.props.onClearToast}
        />
      );

    if (this.props.notifyLoading && this.props.notifyLoading !== '')
      processingSnackbar = (
        <LoadingSnackbar notifyLoading={this.props.notifyLoading !== ''} />
      );

    return (
      <StyleRoot>
        <Fragment>
          {errorSnackbar}
          {successSnackbar}
          {processingSnackbar}
          {finishTestSnackBar}
          <QuizNavbar />
          {this.getTestTitle(this.props.test.name, classes)}
          <Grid container="container" direction="row" justify="center" className={classes.containerNoSpacing}>
            <ItemGrid xs={12} sm={6} md={6}>
              <div classNames={classes.questionContentCard}>
                {this.getCardContent(classes)}
              </div>
            </ItemGrid>
            <ItemGrid style={{ padding: '15px !important' }} xs={12} sm={3} md={3}>
              <Card classNames={classes.navigationContentCard}>
                {this.getSectionNavigationContent(classes)}
              </Card>
              <Button
                variant="fab"
                color="primary"
                name="previous"
                onClick={this.handleArrowPrev}
                style={{ margin: 16, backgroundColor: '#13b38b', }}
              >
                <KeyboardArrowLeft />
              </Button>
              <Button
                variant="fab"
                color="primary"
                name="next"
                onClick={this.handleArrowNext}
                style={{ margin: 16, float: 'right', backgroundColor: '#13b38b', }}
              >
                <KeyboardArrowRight />
              </Button>

            </ItemGrid>
          </Grid>
        </Fragment>
      </StyleRoot>
    );
  }
}
Quiz.PropTypes = {
  quiz: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    result: state.result.result,
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
    currentUser: state.auth.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmitResult: (url, Sections) => dispatch(actions.submitResultAction(url, Sections)),
    onClearToast: () => dispatch(actions.notifyClear())
  };
};

export default Radium(connect(mapStateToProps, mapDispatchToProps)(
  withStyles(quizStyles)(Quiz))
);
//Radium Documentation (https://formidable.com/open-source/radium/)
