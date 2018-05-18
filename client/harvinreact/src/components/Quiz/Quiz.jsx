//TODO SWATI REMOVE CARDS, LEFT ALIGN DETAIL AND REMOVE ACTIVATOR
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
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
} from 'material-ui';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowDown,
} from 'material-ui-icons';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { RegularCard, ItemGrid } from '../';
import {
  ErrorSnackbar,
  LoadingSnackbar,
  SuccessSnackbar
} from '../../components/GlobalSnackbar/GlobalSnackbar';
import axios from 'axios';
import HtmlToReact from 'html-to-react';
import quizStyles from '../../variables/styles/quizStyles';
import _ from 'lodash';
const HtmlToReactParser = HtmlToReact.Parser;

class Quiz extends Component {
  state = {
    questions: [],
    currentQuestion: '',
    currentSection:'',
    currentOptions: [],
    expandedSection: '',    
    answers: [],
    test: 'test',
  };
  componentDidMount = () => {

  };

  handleQuizNavClick = (e,questions) => {
    
    const curr = _.find(questions, function (o) {
      return o._id === e.target.id;
    });
    console.log('cerr',questions,e.target.id,curr)

    let currentOptions = curr.options || [];
    this.setState({ currentQuestion: curr, currentOptions });
  };
  handlePanelExpansion = (e, id) => {
    e.stopPropagation();
    if (id === this.state.expandedSection)
      this.setState({ expandedSection: -1 });
    else this.setState({ expandedSection: id });
  };


  handleChangeQuizOptionChange = e => {
    const sectionAnswer=_.find(this.state.sectionAnswers,secObj=>{
      return secObj._id===this.state.expandedSection
    })
    console.log('sectionAnswer',sectionAnswer)
    const answerObj = _.find(sectionAnswer.answer, o => {

      return o._id === this.state.currentQuestion._id;


    });
    const answerObjIndex = _.findIndex(sectionAnswer.answer, o => {
      return o._id === this.state.currentQuestion._id;
    });
    console.log('sectionAnswer',answerObj)
    
  
    let foundVal = _.indexOf(answerObj.options, e.target.value);
    console.log('target',e.target)
    if (foundVal === -1) {
      answerObj.options.push(e.target.value);
    } else {
      _.remove(answerObj.options, obj => {
        if (obj === e.target.value) return obj === e.target.value;
      });
    }

    const newAnswers = [];
    // this.state.answers.forEach((object, val) => {
    //   val === answerObjIndex
    //     ? newAnswers.push(answerObj)
    //     : newAnswers.push(object);
    // });
    console.log('setState',newAnswers)
    this.setState({ 'dsajhdash': newAnswers })
  };


  getOptions = () => {
    let answerObj = null;
    

    if (typeof this.state.currentQuestion == 'object') {
      const sectionAnswer=_.find(this.state.sectionAnswers,secObj=>{
        return secObj._id===this.state.expandedSection
      })
      console.log('sectionAnswer',sectionAnswer)
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
            return option.text === optionObj;
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
  };

  onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('answers', JSON.stringify(this.state.answers));
    axios
      .post('http://localhost:3001/admin/answers', formData)
      .then(res => {
        alert(`You have scored ${res.data.marks}`);
      })
      .catch(err => console.log('err', err));
  };
  getSectionNavigationContent = classes => {
    if(!this.state.test.sections)
    return ;
    return (
      <div>
        {this.state.test.sections.map((section) => {
          return (<ExpansionPanel
            expanded={section._id === this.state.expandedSection}
            onChange={e => {
              this.handlePanelExpansion(e, section._id);
            }}
          >
            <ExpansionPanelSummary expandIcon={<KeyboardArrowDown />}>
              <Typography className={classes.heading}>{section.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {this.getQuestionNavigationContent(classes,section.questions)}
            </ExpansionPanelDetails>
          </ExpansionPanel>)
        })}
      </div>
    )

  }
  getQuestionNavigationContent = (classes,questions) => {
    let selectedQ = _.find(questions, question => {
      return question._id === this.state.currentQuestion._id;
    })||{};
    
    return questions.map((question, i) => {
      
      let badges = [];
      let qStatus = '';
      if (question._id === selectedQ._id) qStatus = classes.selectedQuestion;
      if (question.markForLater)
        badges = [
          ...badges,
          <Badge
            badgeContent="!"
            className={`${classes.badge} ${classes.markBadge}`}
            color="primary"
          >
            .{' '}
          </Badge>,
        ];
      try {
        if (this.state.answers[i].options.length > 0) {
          qStatus = `${qStatus} ${classes.qStatus}`;
        }

        console.log('qstatus', qStatus);
      } catch (err) {
        console.log('qerr', err);
      }
      return (
        <Fragment>
          <button
            id={question._id}
            value={question._id}
            key={question._id}
            aria-label="add"
            className={`${classes.quizNavButton} ${qStatus}`}
            onClick={(val)=>{this.handleQuizNavClick(val,questions)}}
          >
            {i + 1}
            {badges}
          </button>
        </Fragment>
      );
    });
  };
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.test) {
      console.log('nextProp', nextProps)
      
      const answerObj=nextProps.test.sections.map((section,i)=>{
        const innObj=section.questions.map((question)=>{
          return {_id:question._id,options:[]}
        })
        return {_id:section._id,answer:innObj}
      })
      return { test: nextProps.test, questions: nextProps.test.sections[0].questions,sectionAnswers:answerObj }
    }
    return {}
  }
  handleMarkForLater = event => {
    const currentQuestionState = this.state.currentQuestion;
    currentQuestionState.markForLater = event.target.checked;
    this.setState({ currentQuestion: currentQuestionState });
  };

  handleArrowPrev = e => {
    let currentIndex = _.findIndex(this.state.questions, question => {
      return question._id === this.state.currentQuestion._id;
    });
    console.log('hello', currentIndex);
    if (currentIndex <= 0) return;

    currentIndex--;

    console.log('setting', this.state.questions[currentIndex], currentIndex);
    this.setState({
      currentQuestion: this.state.questions[currentIndex],
      currentOptions: this.state.questions[currentIndex].options,
    });
  };

  handleArrowNext = e => {
    let currentIndex = _.findIndex(this.state.questions, question => {
      return question._id === this.state.currentQuestion._id;
    });
    console.log('hello', currentIndex);

    if (currentIndex === this.state.questions.length - 1) return;

    currentIndex++;
    console.log('setting', this.state.questions[currentIndex], currentIndex);
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
    return (
      <div>
        {reactElement}
        {opt}
        {markForLater}
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;
    console.log('')
    if (this.props.errorMessage && this.props.errorMessage !== '')
      errorSnackbar = (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      );

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
              content={this.getCardContent(classes)}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={4} md={4}>
            <RegularCard
              cardTitle="Select any question to navigate"
              cardSubtitle=""
              headerColor="blue"
              content={this.getSectionNavigationContent(classes)}
            />
            <Button
              variant="fab"
              color="primary"
              name="previous"
              onClick={this.handleArrowPrev}
              style={{ margin: 16 }}
            >
              <KeyboardArrowLeft />
            </Button>
            <Button
              variant="fab"
              color="primary"
              name="next"
              onClick={this.handleArrowNext}
              style={{ margin: 16 }}
            >
              <KeyboardArrowRight />
            </Button>
            <Button
              variant="raised"
              color="primary"
              onClick={this.onSubmit}
              style={{ margin: 16 }}
            >
              submit
            </Button>
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}
Quiz.PropTypes = {
  quiz: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  bindActionCreators({}, dispatch);
  return;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(quizStyles)(Quiz));
