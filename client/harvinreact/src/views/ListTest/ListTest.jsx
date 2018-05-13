import React, { Fragment } from 'react';
import HtmlToReact from "html-to-react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'immutability-helper';
import _ from 'lodash';
import quizStyles from '../../variables/styles/quizStyles';
import { getTestList, getAllQuestions } from '../../actions/';
import {
    withStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
    Grid,
    Checkbox,
    Tooltip,
    IconButton,
    Button,
} from 'material-ui';
import { ExpandMore, Add, Clear } from "material-ui-icons";

const HtmlToReactParser = HtmlToReact.Parser;


class Test extends React.Component {
    state = {
        expanded:false,
        tests: [],
        sections: [{
            title: 'New Section',
            posMarks: 4,
            negMarks: -1,
            questions: [
                "5af81fcfb7588b41e60798a4",
                "5af6ec76e89b041ec181d932",
                "5af84015b7588b41e60798a5"
            ],
        }],
    }
    getEmptySection=()=>{ return {
        title: 'New Section',
            posMarks: 4,
            negMarks: -1,
            questions: [
              
            ],
    }}
    componentDidMount = () => {
        this.props.getTestList('j');
        this.props.getAllQuestions();
    }
    handleAddQuestionToTestClick = (e) => {
        e.stopPropagation()

    }
    handleAddSectionToTestClick=(e)=>{
        e.stopPropagation()
        const sections=this.state.sections
        const empty=this.getEmptySection()
        const up=update(sections,{$push:[empty]})
        console.log('up',up)
        this.setState({sections:up})
    }
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
        let htmlToReactParser = new HtmlToReactParser();

        return (<div>
            <Grid container justify="center">
                <h3>Create a test</h3>
                <Grid item xs={12}>
                    {this.state.sections.map((section, i) => {
                        return (<ExpansionPanel >
                            <ExpansionPanelSummary expanded={this.state.expanded}expandIcon={<ExpandMore />}>
                                <Typography style={{ alignSelf: 'center', marginRight: '5px', }} >
                                    Section.{i + 1}
                                </Typography>
                                {section.title}

                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid item>
                                    {
                                        section.questions.map((question, i) => {
                                            const f = _.find(this.props.allQuestions, (obj) => {
                                                return obj._id == question
                                            })
                                            if (f) {
                                                let reactElement = htmlToReactParser.parse(f.question);
                                                return (<div style={{ display: 'flex', flexWrap: 'initial'}}>
                                                    <Typography style={{ alignSelf: 'center', marginRight: '5px', }} >
                                                        Q.{i + 1}
                                                    </Typography>
                                                    {reactElement}</div>)
                                            }
                                            else return
                                        })}
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        )
                    })}
                    <Button variant="fab" onClick={this.handleAddSectionToTestClick}>
                        <Add/>
                    </Button>

                </Grid>
            </Grid>

            <Grid container justify="center">
                <h3>Previously added questions</h3>
            </Grid>
            {this.props.allQuestions.map((ques, i) => {
                let reactElement = htmlToReactParser.parse(ques.question);
                return (
                    <ExpansionPanel >
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <Typography style={{ alignSelf: 'center', marginRight: '5px', }} >
                                Q.{i + 1}
                            </Typography>
                            {reactElement}
                            <Tooltip title="Add to Test">
                                <IconButton style={{ amrginLeft: '20px', paddingRight: '0', alignSelf: 'center' }} onClick={this.handleAddQuestionToTestClick}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid >
                                {this.getPrevQuesOptions(ques.options)}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                );
            })}


        </div>)
    }
}
const mapStateToProps = (state) => {
    return { allQuestions: state.questions.allQuestions }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ getTestList, getAllQuestions }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(quizStyles)(Test))