import React, { Component } from "react";
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
  FormControlLabel
} from "material-ui";
import ReactQuill, { Quill } from "react-quill";
import { ExpandMore } from "material-ui-icons";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import HtmlToReact from "html-to-react";
// import { ImageResize } from "quill-image-resize-module";
const HtmlToReactParser = HtmlToReact.Parser;

// Quill.register('modules/imageResize', ImageResize);
class Records extends React.Component {
  state = { text: "", questions: [], checkedB: false };

  handleChange = value => {
    this.setState({ text: value });
  };

  handleCheckboxChanged = () => {
    this.setState({checkedB : !this.state.checkedB})
  }

  onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("question", this.state.text);
    axios
      .post("http://localhost:3001/admin/questions", formData)
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  };

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

  render() {
    return <div>
        <Grid style={{ display: "flex" }} justify="center">
          <h3>Add a ques</h3>
        </Grid>
        <ReactQuill value={this.state.text} onChange={this.handleChange} ref={editor => (this.editor = editor)} style={{ backgroundColor: "white" }} modules={{ toolbar: [["bold", "italic", "underline", "strike"], ["blockquote", "code-block"], [{ list: "ordered" }, { list: "bullet" }], [{ script: "sub" }, { script: "super" }], [{ indent: "-1" }, { indent: "+1" }], [{ direction: "rtl" }], [{ size: ["small", false, "large", "huge"] }], [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ color: [] }, { background: [] }], [{ align: [] }], ["clean"], ["link", "image", "video", "formula"]] }} />
        <ExpansionPanel style={{ marginTop: 16, marginBottom: 16 }}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography>Choose correct answers</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checkedB}
              onChange={this.handleCheckboxChanged}
              value="checkedB"
              color="primary"
            />
          }
          label="1 ) 1"
        />
        </ExpansionPanel>
        <Grid style={{ display: "flex" }} justify="center">
          <Button variant="raised" color="primary" onClick={this.onSubmit} style={{ margin: 16 }}>
            submit
          </Button>
        </Grid>
        <Grid style={{ display: "flex" }} justify="center">
          <h3>Previously added questions</h3>
        </Grid>
        {this.state.questions.map((ques, i) => {
          let htmlToReactParser = new HtmlToReactParser();
          let reactElement = htmlToReactParser.parse(ques.question);
          return <Paper style={{ padding: 16, marginTop: 16 }}>
              Q.{i + 1} {reactElement}
            </Paper>;
        })}
      </div>;
  }
}

export default Records;
