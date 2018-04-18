import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import dashboardStyle from "../../variables/styles/dashboardStyle";
import { Add, Send, FileUpload, Clear, Done } from 'material-ui-icons';
import Autosuggest from "react-autosuggest";
import { bindActionCreators } from "redux";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Snackbar from "../../components/Snackbar/Snackbar";
import * as _ from 'lodash'
import {
  withStyles,
  Grid,
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  Paper,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress
} from "material-ui";

import { RegularCard, ItemGrid, CustomInput } from "../../components";
class Stock extends Component {
  state = {
    selectedVendor: "",
    selectedVendorId: null,
    selectedProduct: "",
    p_quantity: "",
    p_minimumQuantity: "",
    p_category: "",
    p_price: "",
    p_rating: "",
    n_quantity: "",
    n_minimumQuantity: "",
    n_category: "",
    n_price: "",
    n_rating: "",
    isAddVendorDialogOpen: false,
    productSuggestions: this.props.products || [],
    vendorSuggestions: this.props.vendors || [],
    bill: null,
    billName: 'Upload the Bill from Vendor',
  };

  componentDidMount() {
    this.props.onProductsFetch();
    this.props.onVendorsFetch();
  }

  handleAddVendorOpen = () => {
    this.setState({
      isAddVendorDialogOpen: true
    });
  };

  handleAddVendorClose = value => {
    this.setState({ isAddVendorDialogOpen: false });
  };
  handleProductsFetchRequested = ({ value }) => {
    this.setState({
      productSuggestions: this.getProducts(value)
    });
  };

  handleVendorsFetchRequested = ({ value, reason }) => {
    this.setState({
      vendorSuggestions: this.getVendors(value)
    });
  };

  handleProductsClearRequested = () => {
    this.setState({
      productSuggestions: []
    });
  };

  handleVendorsClearRequested = () => {
    this.setState({
      vendorSuggestions: []
    });
  };

  handleProductChange = (event, { newValue }) => {
    this.setState({
      selectedProduct: newValue
    });
  };

  handleVendorChange = (event, { newValue }) => {
    this.setState({
      selectedVendor: newValue
    });
  };

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

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

  onProductSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    const index = _.findIndex(this.props.products, function (o) { return o.name == suggestionValue; });
    const selectedProduct = this.props.products[index];
    this.setState({
      p_quantity: selectedProduct.quantity,
      p_minimumQuantity: selectedProduct.minimumQuantity,
      p_category: selectedProduct.category,
      p_price: selectedProduct.price
    });
  };

  // FIXME: debug it - it always selects index 0 if new vendor added
  onVendorSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    if (suggestion.isAddNew) {
      this.setState({
        isAddVendorDialogOpen: true
      });
    } else {
      const index = _.findIndex(this.props.vendors, function (o) { return o.name == suggestionValue; });
      const selectedVendor = this.props.vendors[index];
      this.setState({
        p_rating: selectedVendor.quality,
        selectedVendorId: selectedVendor._id
      });
    }
  };

  // TODO: why 'this.props.isAddStockCompleted' in first if condition
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.isAddVendorInProgress && nextProps.successMessage === 'Successfully added the vendor.') {
      const addedVendor = nextProps.vendors[0]
      return {
        isAddVendorDialogOpen: false,
        selectedVendor: addedVendor.name,
        selectedVendorId: addedVendor._id
      };
    } else if (!nextProps.isAddStockInProgress && nextProps.successMessage === 'Successfully added the item into stock.') {
      // reset the form fields
      return {
        selectedVendor: '',
        selectedProduct: '',
        selectedVendorId: null,
        p_quantity: "",
        p_minimumQuantity: "",
        p_category: "",
        p_price: "",
        p_rating: "",
        n_quantity: "",
        n_minimumQuantity: "",
        n_category: "",
        n_price: "",
        n_rating: "",
        isAddVendorDialogOpen: false,
      };
    }
    return null
  }

  getCardContent() {
    const { classes } = this.props;
    const stockSubmitBtn = (
      <Button
        variant="fab"
        color="primary"
        aria-label="Submit"
        disabled={this.props.isAddStockInProgress}
        onClick={() => {
          let formData = new FormData();
          formData.append("vendor", this.state.selectedVendorId);
          formData.append("quantity", this.state.n_quantity);
          formData.append("quality", this.state.n_rating);
          formData.append("name", this.state.selectedProduct);
          formData.append("price", this.state.n_price);
          formData.append("minimumQuantity", this.state.n_minimumQuantity);
          formData.append("category", this.state.n_category);
          formData.append("bill", this.state.bill);
          return this.props.onStockSubmit(formData)
        }
        }
        color="primary"
      >
        <Send />
      </Button>
    )

    return (
      <Fragment>
        <Grid
          container
          direction={"row"}
          justify={"space-around"}
          alignItems={"center"}
        >
          <ItemGrid sm={12} md={11} xl={10}>
            <FormControl className={""} margin='normal' style={{ minWidth: "100%" }}>
              <Autosuggest
                theme={{
                  container: classes.container,
                  suggestionsContainerOpen: classes.suggestionsContainerOpen,
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion
                }}
                renderInputComponent={this.renderInput}
                suggestions={this.state.productSuggestions}
                onSuggestionsFetchRequested={this.handleProductsFetchRequested}
                onSuggestionsClearRequested={this.handleProductsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderProductSuggestion}
                onSuggestionSelected={this.onProductSelected}
                id={"productsAutosuggst"}
                inputProps={{
                  classes,
                  placeholder: "Search the Product...",
                  value: this.state.selectedProduct,
                  onChange: this.handleProductChange,
                  onFocus: this.props.onProductsFetch
                }}
              />
            </FormControl>
          </ItemGrid>
        </Grid>

        <Grid
          container
          direction={"row"}
          justify={"space-around"}
          alignItems={"center"}
        >
          <ItemGrid xs={12} sm={6} md={5} xl={4}>
            <Grid
              container
              direction={"row"}
              justify={"space-around"}
              alignItems={"center"}
            >
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  required={true}
                  margin="normal"
                  id="n_quantity"
                  label="Qantity to add"
                  type="number"
                  name="n_quantity"
                  value={this.state.n_quantity}
                  fullWidth
                  onChange={this.onInputChange}
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="p_quantity"
                  label="Current quantity"
                  type="number"
                  value={this.state.p_quantity}
                  disabled
                  fullWidth
                />
              </ItemGrid>
            </Grid>
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={5} xl={4}>
            <Grid
              container
              direction={"row"}
              justify={"space-around"}
              alignItems={"center"}
            >
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="n_minimumQuantity"
                  name="n_minimumQuantity"
                  label="New reorder Value"
                  type="number"
                  value={this.state.n_minimumQuantity}
                  fullWidth
                  onChange={this.onInputChange}
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="p_minimumQuantity"
                  label="Current Reorder Value"
                  type="number"
                  value={this.state.p_minimumQuantity}
                  disabled
                  fullWidth
                />
              </ItemGrid>
            </Grid>
          </ItemGrid>
        </Grid>

        <Grid
          container
          direction={"row"}
          justify={"space-around"}
          alignItems={"center"}
        >
          <ItemGrid xs={12} sm={6} md={5} xl={4}>
            <Grid
              container
              direction={"row"}
              justify={"space-around"}
              alignItems={"center"}
            >
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="n_category"
                  name="n_category"
                  label="New Category"
                  type="text"
                  value={this.state.n_category}
                  fullWidth
                  onChange={this.onInputChange}
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="p_category"
                  label="Current Category"
                  type="text"
                  value={this.state.p_category}
                  disabled
                  fullWidth
                />
              </ItemGrid>
            </Grid>
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={5} xl={4}>
            <Grid
              container
              direction={"row"}
              justify={"space-around"}
              alignItems={"center"}
            >
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="n_price"
                  name="n_price"
                  label="New Price"
                  type="number"
                  value={this.state.n_price}
                  fullWidth
                  onChange={this.onInputChange}
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="p_price"
                  label="Current Price"
                  type="number"
                  value={this.state.p_price}
                  disabled
                  fullWidth
                />
              </ItemGrid>
            </Grid>
          </ItemGrid>
        </Grid>

        <Grid
          container
          direction={"row"}
          justify={"center"}
          alignItems={"flex-end"}
        >
          <ItemGrid sm={11} md={10} xl={9}>
            <FormControl className={""} margin='normal' style={{ width: "100%" }}>
              <Autosuggest
                theme={{
                  container: classes.container,
                  suggestionsContainerOpen: classes.suggestionsContainerOpen,
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion
                }}
                renderInputComponent={this.renderInput}
                suggestions={this.state.vendorSuggestions}
                onSuggestionsFetchRequested={this.handleVendorsFetchRequested}
                onSuggestionsClearRequested={this.handleVendorsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderVendorSuggestion}
                onSuggestionSelected={this.onVendorSelected}
                inputProps={{
                  classes,
                  placeholder: "Search the Vendor...",
                  value: this.state.selectedVendor,
                  onChange: this.handleVendorChange,
                  onFocus: this.props.onVendorsFetch
                }}
              />
            </FormControl>
          </ItemGrid>
          <ItemGrid sm={1}>
            <Tooltip
              title="Add new Vendor"
              className={classes.addVentorTooltipBtn}
            >
              <IconButton
                variant="fab"
                mini
                color="primary"
                className={this.props.classes}
                onClick={this.handleAddVendorOpen}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </ItemGrid>
          <SimpleDialogWrapped
            vendorName={this.state.selectedVendor}
            open={this.state.isAddVendorDialogOpen}
            onClose={this.handleAddVendorClose}
            onAddVendorSubmit={this.props.onVendorAdd}
            disableAddVendorSubmit={this.props.isAddVendorInProgress}
          />
        </Grid>

        <Grid
          container
          direction={"row"}
          justify={"space-around"}
          alignItems={"center"}
        >
          <ItemGrid xs={12} sm={6} md={5} xl={4}>
            <Grid
              container
              direction={"row"}
              justify={"space-around"}
              alignItems={"center"}
            >
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  required={true}
                  margin="normal"
                  id="n_rating"
                  name="n_rating"
                  label="Rate this delivery (out of 5)"
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 5
                  }}
                  value={this.state.n_rating}
                  fullWidth
                  onChange={this.onInputChange}
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={6} md={5} xl={4}>
                <TextField
                  margin="normal"
                  id="p_rating"
                  label="Current Avg rating"
                  type="number"
                  value={this.state.p_rating}
                  disabled
                  fullWidth
                />
              </ItemGrid>
            </Grid>
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={5} xl={4} style={{ marginTop: 30 }}>
            <Grid
              container
              direction={"row"}
              justify={"center"}
              alignItems={"center"}
            >
              <ItemGrid xs={12} sm={6}>
                <span >  {this.state.billName}</span>
              </ItemGrid>
              <ItemGrid xs={12} sm={2} >
                <input
                  accept="image/*"
                  className={classes.input}
                  id="raised-button-file"
                  type="file"
                  name='bill'
                  onChange={this._handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="raised" component="span" color="default">
                    <FileUpload />
                  </Button>
                </label>
              </ItemGrid>
            </Grid>
          </ItemGrid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex" }}
          alignItems="center"
          direction="row"
          justify="center"
        >
          {stockSubmitBtn}
        </Grid>
      </Fragment>
    );
  }

  render() {
    // TODO: Refactor it into single snackbar
    // general snackbar
    let errorSnackbar = null;
    let successSnackbar = null;
    let processingSnackbar = null;

    if (this.props.errorMessage !== '')
      errorSnackbar = (
        <Snackbar
          classes={{}}
          message={this.props.errorMessage || 'Something went wrong :('}
          color={"danger"}
          place={"tr"}
          open={this.props.errorMessage !== ''}
          close={true}
          onClearToast={this.props.onClearToast}
        />
      );
    else errorSnackbar = null

    if (this.props.successMessage !== '')
      successSnackbar = (
        <Snackbar
          classes={{}}
          message={this.props.successMessage || 'Success :)'}
          color={"success"}
          place={"tr"}
          open={this.props.successMessage !== ''}
          close={true}
          onClearToast={this.props.onClearToast}
        />
      );
    else successSnackbar = null

    if (this.props.notifyLoading !== '')
      processingSnackbar = (
        <Snackbar
          classes={{}}
          message={'Loading...'}
          color={"warning"}
          place={"tr"}
          open={this.props.notifyLoading !== ''}
          close={true}
          onClearToast={() => { }}
        />
      );
    else processingSnackbar = null

    return (
      <Fragment>
        {errorSnackbar}
        {successSnackbar}
        {processingSnackbar}
        <Grid container="container">
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="Add Inventory Stock"
              cardSubtitle="Add items to this whenever you purchase inventory"
              headerColor="blue"
              content={this.getCardContent()}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }

  renderInput = inputProps => {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: ref,
          classes: {
            input: classes.input
          },
          ...other
        }}
      />
    );
  };

  renderProductSuggestion = (suggestion, { query, isHighlighted }) => {
    if (suggestion.isAddNew) {
      return (
        <span>
          [+] Add new: <strong>{this.state.selectedVendor}</strong>
        </span>
      );
    }
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
                <strong key={String(index)} style={{ fontWeight: 600 }}>
                  {part.text}
                </strong>
              );
          })}
          <span style={{ color: "#828080", marginLeft: 50 }}>₹ {suggestion.price}</span>
          <span style={{ color: "#828080", marginLeft: 50 }}>category: {suggestion.category || '--------'}</span>
          <span style={{ color: "#828080", marginLeft: 50 }}>remaining: {suggestion.quantity || 0} items</span>
        </div>
      </MenuItem>
    );
  };

  renderVendorSuggestion = (suggestion, { query, isHighlighted }) => {
    if (suggestion.isAddNew) {
      return (
        <span>
          [+] Add new: <strong>{this.state.selectedVendor}</strong>
        </span>
      );
    }
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
                <strong key={String(index)} style={{ fontWeight: 600 }}>
                  {part.text}
                </strong>
              );
          })}
          <span style={{ color: "#828080", marginLeft: 50 }}>&#9733; {suggestion.quality || '0.00'}</span>
          {/* <span  style={{ color: "#828080", marginLeft: 50 }}>&#9742; {suggestion.phone || '----------'}</span>
          <span  style={{ color: "#828080", marginLeft: 50 }}>&#8721; {suggestion.email || ''}</span> */}
        </div>
      </MenuItem>
    );
  };

  renderSuggestionsContainer = options => {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} style={{ maxHeight: '200px', overflowY: 'scroll' }} square>
        {children}
      </Paper>
    );
  };

  getSuggestionValue = suggestion => {
    if (suggestion.isAddNew) {
      return this.state.selectedVendor;
    }
    return suggestion.name;
  };
  getProducts = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    const returnedResults =
      inputLength === 0
        ? []
        : this.props.products.filter(suggestion => {
          const keep =
            suggestion.name.toLowerCase().slice(0, inputLength) ===
            inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
    return returnedResults;
  };

  getVendors = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    const suggetions =
      inputLength === 0
        ? []
        : this.props.vendors.filter(suggestion => {
          const keep =
            suggestion.name.toLowerCase().slice(0, inputLength) ===
            inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });

    if (suggetions.length === 0) {
      return [{ isAddNew: true }];
    }

    return suggetions;
  };
}

class SimpleDialog extends React.Component {
  state = {
    vendorName: "",
    vendorEmail: "",
    vendorPhone: ""
  };

  componentWillReceiveProps(nextProps) {
    const vendorName =
      nextProps.vendorName !== ""
        ? nextProps.vendorName
        : "";
    this.setState({ vendorName });
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;
    // TODO: send form data on submit
    const addVendorSubmit = this.props.disableAddVendorSubmit ? (
      <CircularProgress />
    ) : (
        <IconButton
          disabled={this.props.disableAddVendorSubmit}
          onClick={() =>
            this.props.onAddVendorSubmit({
              vendorName: this.state.vendorName,
              vendorEmail: this.state.vendorEmail,
              vendorPhone: this.state.vendorPhone
            })
          }
          color="primary"
        >
          <Done />
        </IconButton>
      );

    return (
      <Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new vendor</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="normal"
              id="vendorName"
              label="Vendor Name"
              type="text"
              value={this.state.vendorName}
              onChange={this.onInputChange}
              name="vendorName"
              fullWidth
            />

            <TextField
              margin="normal"
              id="vendorEmail"
              label="Vendor Email"
              type="email"
              value={this.state.vendorEmail}
              onChange={this.onInputChange}
              name="vendorEmail"
              fullWidth
            />

            <TextField
              margin="normal"
              id="vendorPhone"
              label="Vendor Phone"
              type="phone"
              value={this.state.vendorPhone}
              onChange={this.onInputChange}
              name="vendorPhone"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={this.props.onClose} color="primary">
              <Clear />
            </IconButton>
            {addVendorSubmit}
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const SimpleDialogWrapped = withStyles()(SimpleDialog);

Stock.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    products: state.invt.products,
    vendors: state.vend.vendors,
    isAddVendorInProgress: state.vend.isAddVendorInProgress,
    isAddStockInProgress: state.stock.isAddStockInProgress,
    addedProduct: state.invt.addedProduct,
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProductsFetch: () => dispatch(actions.getProducts()),
    onVendorsFetch: () => dispatch(actions.getVendors()),
    onVendorAdd: newVendor => dispatch(actions.onAddVendor(newVendor)),
    onStockSubmit: newStock => dispatch(actions.onStockSubmit(newStock)),
    onClearToast: () => dispatch(actions.notifyClear())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(dashboardStyle)(Stock)
);
