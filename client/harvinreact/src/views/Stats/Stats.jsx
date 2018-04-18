import React, { Component, Fragment } from "react";
import classNames from 'classnames';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import dashboardStyle from "../../variables/styles/dashboardStyle";
import { Delete, FilterList } from 'material-ui-icons';
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
} from "material-ui";

import { lighten } from 'material-ui/styles/colorManipulator';

import { RegularCard, ItemGrid, CustomInput } from "../../components";

function createData(id, date, type, product, department, vendor, quantity) {
  const newDate = new Date(date)
  return { id, date: newDate.toLocaleString(), type, product, department, vendor, quantity };
}

const columnData = [
  { id: 'date', numeric: true, disablePadding: true, label: 'Date' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
  { id: 'product', numeric: false, disablePadding: false, label: 'Product' },
  { id: 'department', numeric: false, disablePadding: false, label: 'Department' },
  { id: 'vendor', numeric: false, disablePadding: false, label: 'Vendor' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="title">Transactions</Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <Delete />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterList />
              </IconButton>
            </Tooltip>
          )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);


class Stats extends Component {
  state = {
    transactions: null,
    order: 'asc',
    orderBy: 'date',
    selected: [],
    page: 0,
    rowsPerPage: 5,
    data: [],
  };

  componentDidMount() {
    this.props.onTransactionsFetch()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetchTransactionsCompleted && nextProps.transactions && nextProps.transactions.length > 0) {
      const transactions = nextProps.transactions
      const data = transactions.map(t => {
        if (t.isSell)
          return createData(t._id, t.date, t.isSell, t.inventory.name, t.department.name, '-', t.quantity)
        else
          return createData(t._id, t.date, t.isSell, t.inventory.name, '-', t.vendor.name, t.quantity)
      }).sort((a, b) => (a.quantity < b.quantity ? -1 : 1))

      this.setState({ data })
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  getCardContent() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
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

    const table = (
      <Fragment className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell padding="none">{n.date}</TableCell>
                    <TableCell >{n.type ? 'Sell' : 'Purchase'}</TableCell>
                    <TableCell numeric>{n.quantity}</TableCell>
                    <TableCell >{n.product}</TableCell>
                    <TableCell >{n.department}</TableCell>
                    <TableCell >{n.vendor}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Fragment>
    )

    const transactions = this.state.data && this.state.data.length > 0 ? table : circularProgress

    return (
      <Fragment>
        {transactions}
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
    minWidth: 100,
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
    transactions: state.stats.transactions,
    isFetchTransactionsCompleted: state.stats.isFetchTransactionsCompleted,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTransactionsFetch: () => dispatch(actions.getTransactions()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(dashboardStyle)(Stats)
);
