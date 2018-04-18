import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import dashboardStyle from '../../variables/styles/dashboardStyle';
import { getDeptList } from '../../actions/dept_action';
import { getProducts, sendDeptOrder, addDept } from '../../actions';
import { bindActionCreators } from 'redux';

import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Autosuggest from "react-autosuggest";
import classnames from 'classnames';
import { connect } from 'react-redux';

import { Add, Send, FileUpload, Clear, Done } from 'material-ui-icons';


import {
  withStyles,
  CircularProgress,
  Grid,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Button,
  Snackbar,
  Tooltip,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
  Typography,
} from "material-ui";

import { RegularCard, ItemGrid } from '../../components';
class Order extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      orderVal: '',
      selectedDepartment: '',
      selectedProduct: '',
      productSuggetions: this.props.products || [],
      departmentSuggestions: this.props.departments || [],
      addDeptName: '',
      isAddDeptDialogOpen: false,
      addDeptSubmitInProg: false,
      bill: null,
      billName: 'Upload the Bill from Department'
    };
  }

  handleDepartmentsFetchRequested = ({ value }) => {
    this.setState({ departmentSuggestions: this.getDepartments(value) });
  }
  handleDepartmentsClearRequested = () => { this.setState({ departmentSuggestions: [] }) }
  handleDepartmentChange = (event, { newValue }) => {
    this.setState({
      selectedDepartment: newValue
    });
  }
  handleProductFetchRequest = ({ value }) => {
    this.setState({ productSuggetions: this.getProducts(value) });
  }
  handleProductClearRequested = () => { this.setState({ productSuggetions: [] }) }
  handleProductChange = (event, { newValue }) => {
    this.setState({
      selectedProduct: newValue
    })
  }
  renderInput = inputProps => {
    const { classes, ref, ...other } = inputProps;
    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: ref,
          ...other
        }}
      />
    );
  };

  getSuggestionValue = suggestion => {

    return suggestion.name;
  };
  getDepartments = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    const returnedResults =
      inputLength === 0 || !this.props.departments ? []
        : this.props.departments.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.name.toLowerCase().slice(0, inputLength) ===
            inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
    return returnedResults;
  };

  getProducts = value => {

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    const returendResults =
      inputLength === 0 || !this.props.inventory ? []
        : this.props.inventory.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.name.toLowerCase().slice(0, inputLength) ===
            inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
    return returendResults;
  };

  renderProductSuggestion(suggestion, { query, isHighlighted }) {

    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
      <MenuItem selected={isHighlighted} component="div" >
        <div >
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
                <strong key={String(index)} style={{ fontWeight: 500 }}>
                  {part.text}
                </strong>
              );
          })}
          <span  style={{ color: "#828080", marginLeft: 50 }}>₹ {suggestion.price}</span>
          <span  style={{ color: "#828080", marginLeft: 50 }}>category: {suggestion.category || '--------'}</span>
          <span  style={{ color: "#828080", marginLeft: 50 }}>remaining: {suggestion.quantity || 0} items</span>
        </div>
      </MenuItem>
    );
  }

  renderDeptSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
      <MenuItem selected={isHighlighted} component="div" >
        <div >
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
                <strong key={String(index)} style={{ fontWeight: 500 }}>
                  {part.text}
                </strong>
              );
          })}
        </div>
      </MenuItem>
    );
  }
  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  }
  handleAddDeptDialogClose = () => {
    this.setState({ isAddDeptDialogOpen: false });
  }
  handleAddDeptDialogSend = () => {
    this.setState({ addDeptSubmitInProg: false });
    this.props.addDept({
      name: this.state.addDeptName,
    })
  }
  getDialogContent() {
    let addDeptSubmitInProg = '';
    (this.props.addingDept) ?
      addDeptSubmitInProg = (<CircularProgress size={10} />) : addDeptSubmitInProg = (<IconButton onClick={this.handleAddDeptDialogSend} color="primary">
        <Done />
      </IconButton>);

    return (<div>
      <IconButton
        variant="fab"
        onClick={() => {
          this.setState({ isAddDeptDialogOpen: true });
        }
        } color="primary">
        <Add />
      </IconButton>
      <Dialog
        open={this.state.isAddDeptDialogOpen}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="departmentName"
            label="Department Name"
            type="text"
            value={this.state.addDeptName}
            onChange={this.handleChange}
            name="addDeptName"
            fullWidth
          />


        </DialogContent>
        <DialogActions>
          <IconButton onClick={this.handleAddDeptDialogClose} color="primary">
            <Clear />
          </IconButton>

          {addDeptSubmitInProg}
        </DialogActions>
      </Dialog>

    </div>)
  }
  static getDerivedStateFromProps(newProps, prevState) {
    if (newProps.successMessage==='Successfully added the department.') {
      return { selectedDepartment: newProps.departments[0].name, isAddDeptDialogOpen: false, }
    }
    return { isAddDeptDialogOpen: false}
  }
  getCardContent() {
    const { classes } = this.props;
    return (<Fragment>
      <Grid container >

        <Grid item xs={12} >
          <Autosuggest
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion
            }}
            renderInputComponent={this.renderInput}
            suggestions={this.state.productSuggetions}
            onSuggestionsFetchRequested={this.handleProductFetchRequest}
            onSuggestionsClearRequested={this.handleProductClearRequested}
            renderSuggestionsContainer={this.renderSuggestionsContainer}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderProductSuggestion}
            inputProps={{
              onFocus: this.props.getProducts,
              placeholder: 'Select a Product (Auto suggest)',
              value: this.state.selectedProduct,
              onChange: this.handleProductChange,
            }}
          />
        </Grid>

        <Grid item xs={11} >
          <Autosuggest
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion
            }}
            renderInputComponent={this.renderInput}
            suggestions={this.state.departmentSuggestions}
            onSuggestionsFetchRequested={this.handleDepartmentsFetchRequested}
            onSuggestionsClearRequested={this.handleDepartmentsClearRequested}
            renderSuggestionsContainer={this.renderSuggestionsContainer}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderDeptSuggestion}
            inputProps={{
              onFocus: this.props.getDeptList,
              placeholder: 'Select a Department (Auto suggest)',
              value: this.state.selectedDepartment,
              onChange: this.handleDepartmentChange,
            }}
          />

        </Grid>
        <Grid item xs={1}>
          {this.getDialogContent()}

        </Grid>
        <Grid item xs={12} >
          <FormControl style={{ width: '100%' }}>

            <TextField id="orderVal" name="orderVal" margin="none" label="OrderQuantity" value={this.state.orderVal} onChange={this.handleChange} />
          </FormControl>
        </Grid>
        <Grid item xs={10} className={classes.fileInput}>
          <span >  {this.state.billName}</span>
        </Grid>
        <Grid item xs={2}>
          <input
            accept="image/*"
            id="raised-button-file"
            type="file"
            onChange={this._handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="raised-button-file">
            <Button variant="raised" component="span" color="default">
              <FileUpload />
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex' }} alignItems="center"
          direction="row"
          justify="center">
          <Button variant="fab" type="submit" color="primary" aria-label="add" onClick={this.sendDeptOrder}>
            <Send />
          </Button>

        </Grid>

      </Grid>
    </Fragment>);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  _handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        bill: file,
        billName: file.name,
      });
    }
    try {
      reader.readAsDataURL(file)

    } catch (error) {
      console.log(error);
    }
  }

  sendDeptOrder = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("bill", this.state.bill);
    formData.append("quantity", this.state.orderVal)
    formData.append("inventory", this.state.selectedProduct)
    formData.append("department", this.state.selectedDepartment)
    this.props.sendDeptOrder(formData);
  }

  componentDidMount() {
    this.props.getDeptList();
    this.props.getProducts();
  }

  render() {
    const { classes } = this.props;
    let snack = null;
    let loadingSnack = null;
    if (this.props.errorMessage)
    snack = (<Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={this.props.errorMessage}
      onClose={this.haandleClose}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
        classes: {
          root: classes.snackbarError
        },
      }}
      message={<span id="message-id">{this.props.errorMessage}</span>}
    />
    )
    else if (this.props.successMessage)
      snack = (<Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.props.successMessage}
        onClose={this.haandleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
          classes: {
            root: classes.snackbarSuccess
          },
        }}
        message={<span id="message-id">{this.props.successMessage}</span>}
      />
      )
    loadingSnack = <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={this.props.notifyLoading}
      onClose={this.handleClose}
      SnackbarContentProps={{
        'aria-describedby': 'message-id',
        classes: {
          root: classes.snackbarLoading
        },
      }}
      message={<span id="message-id">Loading...</span>}
    />
    return (<Fragment>
      {loadingSnack}{snack}
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard cardTitle="Dispatch Order to a Department" cardSubtitle="Fill this whenever you give departments any inventory" headerColor="blue" content={this.getCardContent()} />
        </ItemGrid>
      </Grid>
    </Fragment>);
  }
}



Order.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDeptList,
    sendDeptOrder,
    getProducts,
    addDept,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    departments: state.dept.departments,
    inventory: state.invt.products,
    sendingDeptOrder: state.order.sendDeptOrderInProg,
    addingDept: state.dept.addDeptOrderInProg,
    successMessage:state.notify.success,
    errorMessage:state.notify.error,
    notifyLoading:state.notify.loading,
    notifyClear:state.notify.clear,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dashboardStyle)(Order));
