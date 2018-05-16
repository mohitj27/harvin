import React, { Fragment } from 'react';
import HtmlToReact from "html-to-react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import update from 'immutability-helper';
import _ from 'lodash';
import quizStyles from '../../variables/styles/quizStyles';
import { fetchTestList, getAllQuestions, sendCreatedTest } from '../../actions/';
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
    TextField,
} from 'material-ui';
import { ExpandMore, Add, Clear } from "material-ui-icons";

const HtmlToReactParser = HtmlToReact.Parser;


class CreateTest extends React.Component {
    state = {
        name: '',
        time: '',
        maxMarks: '',
        expandedSection: 1,
        maxMarks: '',
        tests: [],
        sections: [{
            id: 1,
            title: '',
            posMarks: 4,
            negMarks: -1,
            questions: [
            ],
        }],
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    getEmptySection = () => {
        return {
            id: this.state.sections.length + 1,
            title: '',
            posMarks: 4,
            negMarks: -1,
            questions: [],
        }
    }
    componentDidMount = () => {
        this.props.fetchTestList('j');
        this.props.getAllQuestions();
    }
    handleAddQuestionToTestClick = (e, pos, id) => {
        e.stopPropagation();
        const sections = this.state.sections
        pos = this.state.expandedSection - 1
        console.log('pos', pos);
        try {
            const updated = update(sections, { [pos]: { questions: { $push: [id] } } })
        this.setState({ sections: updated })
        } catch (error) {
            console.log(error)
        }

    }
    handleAddSectionToTestClick = (e) => {
        e.stopPropagation()
        const sections = this.state.sections
        const empty = this.getEmptySection()
        const up = update(sections, { $push: [empty] })
        this.setState({ sections: up })
    }
    handleTestSubmitClick = (e) => {
        e.preventDefault();
        let form = new FormData()
        form.append('sections', JSON.stringify(this.state.sections))
        form.append('name', this.state.name)
        form.append('time', this.state.time)
        form.append('maxMarks', this.state.maxMarks)
        this.props.sendCreatedTest(form)

    }
    handlePanelExpansion = (e, pos) => {
        e.stopPropagation()
        if (pos === this.state.expandedSection)
            this.setState({ expandedSection: -1 })
        else this.setState({ expandedSection: pos })
        console.log('panel change', pos, this.state.expandedSection)
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
                <Grid item xs={6}>
                    <TextField
                        id="name"
                        label="Test Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        margin="normal"
                        name="name"
                    />
                    <TextField
                        id="maxMarks"
                        name="maxMarks"
                        label="Max Marks"
                        value={this.state.maxMarks}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <TextField
                        id="time"
                        name="time"
                        label="Time(in min)"
                        value={this.state.time}
                        onChange={this.handleChange}
                        margin="normal"
                    />

                </Grid>
                <Grid item xs={12}>
                    {this.state.sections.map((section, i) => {
                        return (<ExpansionPanel expanded={section.id === this.state.expandedSection} onChange={(e) => { this.handlePanelExpansion(e, i + 1) }}  >
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>

                                <TextField
                                    id="name"
                                    label="Section Name"
                                    value={section.title}
                                    onChange={this.handleChangeSectionChange}
                                    margin="normal"
                                    name="name"
                                />
                              
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid item xs={6}>
                                <TextField
                                    id="posMarks"
                                    name="posMarks"
                                    label="posMarks"
                                    value={section.posMarks}
                                    onChange={this.handleChangeSectionChange}
                                    margin="normal"
                                />
                                <TextField
                                    id="negMarks"
                                    name="negMarks"
                                    label="negMarks"
                                    value={section.negMarks}
                                    onChange={this.handleChangeSectionChange}
                                    margin="normal"
                                />

                                </Grid>
                                <Grid item>
                                    {
                                        section.questions.map((question, i) => {
                                            const f = _.find(this.props.allQuestions, (obj) => {
                                                return obj._id == question
                                            })
                                            if (f) {
                                                let reactElement = htmlToReactParser.parse(f.question);
                                                return (<div style={{ display: 'flex', flexWrap: 'initial' }}>
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
                        <Add />
                    </Button>
                    <Button variant="raised" onClick={this.handleTestSubmitClick}>
                        Submit
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
                                <IconButton style={{ amrginLeft: '20px', paddingRight: '0', alignSelf: 'center' }} onClick={(e) => {
                                    this.handleAddQuestionToTestClick(e, i, ques._id)
                                }}>
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
    return bindActionCreators({ fetchTestList, getAllQuestions, sendCreatedTest }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(quizStyles)(CreateTest))