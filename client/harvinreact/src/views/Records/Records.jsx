import React, { Component, Fragment } from "react";
import classNames from 'classnames';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { getVendors, getProducts, getDeptList ,editDept,editVendor} from "../../actions";
import dashboardStyle from "../../variables/styles/dashboardStyle";
import { Delete, FilterList, ExpandMore, Inbox, BorderColor } from 'material-ui-icons';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';






import {
  withStyles,
  Grid,
  CircularProgress,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Button,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  List, ListItem, ListItemIcon, ListItemText,
} from "material-ui";

import { lighten } from 'material-ui/styles/colorManipulator';

import { RegularCard, ItemGrid, CustomInput } from "../../components";


class Stats extends Component {
  state = {

  };
  constructor(props) {
    super(props);
    props.getDeptList();
    props.getVendors();
    props.getProducts();
  }

  vendorEditSubmit=(e)=>{
    e.preventDefault();
    const form= new FormData(e.target);
    this.props.editVendor(form);
  }
  getVendors() {
    const { classes } = this.props;

    if (this.props.vendors.length > 0) {
      const items = this.props.vendors.map(vendor => (
        <li className={classes.ul} key={vendor._id}>
          <form onSubmit={this.vendorEditSubmit}noValidate autoComplete="off">
            <TextField
              id="name"
              label="Name"
              margin="normal"
              defaultValue={vendor.name}
            />
            <input value={vendor._id} hidden/>
            <TextField
              id="uncontrolled"
              label="Uncontrolled"
              margin="normal"
              defaultValue={vendor.email}

            />
            <TextField
              required
              id="required"
              label="Required"
              defaultValue={vendor.phone}
              
              margin="normal"
            />
             <IconButton variant="fab" color="secondary" aria-label="edit" className={classes.button}>
              <BorderColor />
            </IconButton>
          </form>
        </li>
      ))
      return items;
    }
    else return <CircularProgress />;
  }
 
  deptEditSubmit=(e)=> {
    e.preventDefault();
    const form= new FormData(e.target);
    this.props.editDept(form);
  }
  getDeptList() {
    const { classes } = this.props;

    if (this.props.depts.length > 0) {
      const items = this.props.depts.map(department => (
        <li className={classes.ul} key={department._id}>
          <form onSubmit={this.deptEditSubmit} noValidate autoComplete="off">
            <TextField
              id="name"
              label="Name"
              name="name"
              defaultValue={department.name}
              deptId={department._id}
            /> <input hidden value={department._id} name="id"/>
            <IconButton type="submit" variant="fab" color="secondary" aria-label="edit" className={classes.button}>
              <BorderColor />
            </IconButton>
          </form></li>
      ))
      return items;
    }
    else return <CircularProgress />;
  }
  getCardContent() {
    const { classes } = this.props;
    const circularProgress = (<Grid container className={classes.root}>
      <Grid item xs={12}>
        <Grid
          container
          spacing={16}
          alignItems={'row'}
          direction={'center'}
          justify={'center'}
        >
          <CircularProgress />
        </Grid>
      </Grid>
    </Grid>)


    return (

      <Fragment>
        <ExpansionPanel onClick={this.props.getDeptList}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography className={classes.heading}>Departments</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionFlex}>
            <ul className={classes.ul}>
              {this.getDeptList()}
            </ul>
          </ExpansionPanelDetails>

        </ExpansionPanel>

        <ExpansionPanel onClick={this.props.getVendors}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography className={classes.heading}>Vendors</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionFlex}>
            <ul className={classes.ul}>
              {this.getVendors()}
            </ul>
          </ExpansionPanelDetails>

        </ExpansionPanel>

        <ExpansionPanel onClick={this.props.getProducts}>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography className={classes.heading}>Products</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionFlex}>
            
          <Table >
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell numeric>Price</TableCell>
            <TableCell numeric>Category</TableCell>
            <TableCell numeric>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.products.map(product => {
            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell numeric>{product.price}</TableCell>
                <TableCell numeric>{product.category}</TableCell>
                <TableCell numeric>{product.quantity}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>


          </ExpansionPanelDetails>

        </ExpansionPanel>

      </Fragment>
    );
  }


  render() {
    return (
      <Fragment>
        <Grid container="container">
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="Recent Transactions"
              cardSubtitle="List of all your sell and purchase transactions"
              headerColor="blue"
              content={this.getCardContent()}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

Stats.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    vendors: state.vend.vendors,
    products: state.invt.products,
    depts: state.dept.departments,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getVendors,
    getProducts,
    getDeptList,
    editDept,
    editVendor,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(dashboardStyle)(Stats)
);
