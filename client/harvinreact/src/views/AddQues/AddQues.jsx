import React, { Component, Fragment } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Paper,
  Grid,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton
} from "material-ui";
import ReactQuill, { Quill } from "react-quill";
import { ExpandMore, Add, Clear } from "material-ui-icons";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import HtmlToReact from "html-to-react";
import update from "immutability-helper";
// import { ImageResize } from "quill-image-resize-module";
const HtmlToReactParser = HtmlToReact.Parser;

// Quill.register('modules/imageResize', ImageResize);
class AddQues extends React.Component {
  state = {
    text: "",
    questions: [],
    options: [],
    optionsHtml:[],
  };

  handleChange = value => {
    this.setState({ text: value });
  };
  handleOptionsChange = (value, pos) =>{
    const optHtml=this.state.optionsHtml
    const newData=update(optHtml,{[pos]:{$set:value}})
    console.log('value',newData)
    this.setState({optionsHtml:newData})
  }

  handleCheckboxChanged = index => {
    const newState = update(this.state, {
      options: {
        [index]: {
          $toggle: ["isAns"]
        }
      }
    });

    this.setState({ options: newState.options });
  };

  onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('question', this.state.text);
    
    const updatedOptions=this.state.options.map((opt,i)=>{
       opt.text=this.state.optionsHtml[i]
       return opt
    }) 
    formData.append('options', JSON.stringify(updatedOptions));
    
    axios
      .post("http://localhost:3001/admin/questions", formData)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  };

  onAddOption = () => {
    const currentLenght = this.state.options.length;
    
    const newOpt = {
        text: ( <ReactQuill
          value={this.state.optionsHtml[currentLenght+1]||''}
          onChange={(value)=>{this.handleOptionsChange(value,currentLenght)}}
          ref={editor => (this.editor = editor)}
          style={{ backgroundColor: 'white' }}
          modules={{
            toolbar: [
              [{ script: 'sub' }, { script: 'super' }],
              ["image"]
            ]
          }}
        />),
        html:this.state.options[currentLenght+1]||'',
        isAns: false,
      };

    const newState = update(this.state, {
      options: {
        $push: [newOpt]
      }
    });

    this.setState({ options: newState.options });
    
    
  };

  onRemoveOption = () => {
    const newState = update(this.state, {
      options: {
        $splice: [[this.state.options.length - 1, 1]]
      }
    });

    this.setState({ options: newState.options });
  };Z

  componentDidMount = () => {
    axios
      .get("http://localhost:3001/admin/questions")
      .then(res => {
        let questions = res.data.questions;
        if (questions.length <= 0) return;
        this.setState({ questions: questions });
      })
      .catch(err => console.log("err", err));
  };

  isAtleastOneOptionSelected = () => {
    for (let i = 0; i < this.state.options.length; i++) {
      if (this.state.options[i].isAns === true) return true;
    }

    return false;
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
    let addButton = null;
    
      addButton = (
        <IconButton
          variant="fab"
          mini
          color="primary"
          onClick={this.onAddOption}
          style={{ marginLeft: 16 }}
        >
          <Add />
        </IconButton>
      );
  
    let options = this.state.options.map((opt, i) => {
      let removeButton = null;
      removeButton = (
        <IconButton
          variant="fab"
          mini
          color="secondary"
          onClick={this.onRemoveOption}
          style={{ marginRight: 16 }}
        >
          <Clear />
        </IconButton>
      );
      return (
        <div style={{ marginRight: 50 }}>
    
              <Checkbox
                checked={opt.isAns}
                onChange={() => {
                  this.handleCheckboxChanged(i);
                }}
                value={opt.text}
                color="primary"
              />
            
            {opt.text}
          
          {removeButton}
        </div>
      );
    });
    return (
      <div>
       
        <Grid style={{ display: "flex" }} justify="center">
          <h3>Previously added questions</h3>
        </Grid>
        {this.state.questions.map((ques, i) => {
          let htmlToReactParser = new HtmlToReactParser();
          let reactElement = htmlToReactParser.parse(ques.question);
          return (
            <ExpansionPanel >
          <ExpansionPanelSummary  expandIcon={<ExpandMore />}>
            <Typography style={{alignSelf:'center',marginRight:'5px',}} >
              Q.{i + 1}        
            </Typography> {reactElement}      
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid style={{ display: "flex", flexWrap: "wrap" }}>{options}          
            {this.getPrevQuesOptions(ques.options)}
          </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
            
          );
        })}
         <Grid style={{ display: "flex" }} justify="center">
          <h3>Add New Question</h3>
        </Grid>
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange}
          ref={editor => (this.editor = editor)}
          style={{ backgroundColor: "white" }}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image", "formula"]
            ]
          }}
        />
        <ExpansionPanel style={{ marginTop: 16, marginBottom: 16 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography>Choose Correct Answer</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid style={{ display: "flex", flexWrap: "wrap" }}>{options}
          {addButton}</Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Grid style={{ display: "flex" }} justify="center">
          <Button
            variant="raised"
            color="primary"
            onClick={this.onSubmit}
            style={{ margin: 16 }}
            disabled={!this.isAtleastOneOptionSelected()}
          >
            submit
          </Button>
        </Grid>
      </div>
    );
  }
}

export default AddQues;
