import React, { Component, Fragment } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as actionTypes from "../../actions/types";
import testListStyle from "../../variables/styles/testListStyle";
import { loginAction, notifyClear } from "../../actions";
import { Link } from "react-router-dom";
import {
  ErrorSnackbar,
  SuccessSnackbar,
  LoadingSnackbar
} from "../../components/GlobalSnackbar/GlobalSnackbar";
import { Delete, FilterList } from "material-ui-icons";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "material-ui/Table";
import { Button } from "material-ui";

import {
  withStyles,
  Grid,
  CircularProgress,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip
} from "material-ui";

import { lighten } from "material-ui/styles/colorManipulator";

import { RegularCard, ItemGrid, CustomInput } from "../../components";

function createData(id, name, created, time, maxMarks) {
  const newDate = new Date(created);
  return {
    id,
    name,
    created: newDate.toLocaleString(),
    // createdBy,
    time,
    maxMarks
  };
}

const columnData = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "created", numeric: false, disablePadding: true, label: "Date" },
  {
    id: "createdBy",
    numeric: false,
    disablePadding: false,
    label: "Created By"
  },
  { id: "time", numeric: false, disablePadding: true, label: "Time (mins)" },
  { id: "maxMarks", numeric: false, disablePadding: true, label: "Marks" }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      classes
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              className={classes.noPad}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                className={classes.noPad}
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? "bottom-end" : "bottom-start"}
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
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, selected, } = props;
  this.handleDelete = (e, selected) => {
    e.preventDefault();
    props.onDeleteIconClick();
    console.log("\nselected ---------:", selected)
  };
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="title">Tests</Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" >
              <Delete onClick={(e) => this.handleDelete(e, selected)} />
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
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

class Stats extends Component {
  state = {
    tests: null,
    order: "asc",
    orderBy: "created",
    selected: [],
    page: 0,
    rowsPerPage: 5,
    data: [],
    isFetchTestListInProgress: false
  };

  componentDidMount() {
    this.props.onTestListFetch();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.isFetchTestListInProgress) {
      const tests = nextProps.tests;
      if (tests && tests.length > 0) {
        const data = tests
          .map(t => {
            return createData(
              t._id,
              t.name,
              t.created,
              // t.createdBy.username,
              t.time,
              t.maxMarks
            );
          })
          .sort((a, b) => (a.time < b.time ? -1 : 1));
        return {
          isFetchTestListInProgress: false,
          tests,
          data
        };
      }
    } else {
      return { isFetchTestListInProgress: nextProps.isFetchTestListInProgress };
    }

    return null;
  }

  handleDeleteSuccess = () => {
    console.log("something will happen here ;;;;;;;;;")
    this.setState({ selected: [], selectedDoctors: [] })
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const data =
      order === "desc"
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    console.log("checked IS :", checked);

    this.setState({ selected: [] });
  };

  handleClick = (event, id, _id, n) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    console.log("id IS:", id, "\n_id IS:", _id, "\n n IS:", n)
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleDeleteIconClick = () => {
    let confirmBox = window.confirm("Are you sure want to delete " + this.state.selected.length + " test enteries")
    if (confirmBox) {
      this.props.onDeleteTest(this.state.selected)
      console.log(this.state.selected, "this.state.selected")
    }
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  getCardContent() {
    const { classes } = this.props;

    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const circularProgress = (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={16}
            alignItems={"row"}
            direction={"center"}
            justify={"center"}
          >
            {" "}
            <CircularProgress />
          </Grid>
        </Grid>
      </Grid>
    );

    const table = (
      <div className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} onDeleteIconClick={() => this.handleDeleteIconClick()} />
        <div className={classes.tableWrapper}>
          <Table className={classes.noPad}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              handleDeleteSuccess={() => this.handleDeleteSuccess()}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              classes={classes}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id, n._id, n)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                      className={classes.noPad}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell padding="none" className={classes.noPad}>
                        {n.name}
                      </TableCell>
                      <TableCell>{n.created}</TableCell>
                      <TableCell className={classes.noPad}>
                        {
                          "You"
                          // n.createdBy === this.props.currentUser.username
                          // ? "You"
                          // : n.createdBy
                        }
                      </TableCell>
                      <TableCell className={classes.noPad}>{n.time}</TableCell>
                      <TableCell className={classes.noPad}>
                        {n.maxMarks}
                      </TableCell>
                      <TableCell className={classes.noPad}>
                        <Link to={`/HarvinQuiz/quiz/${n.id}`}>
                          <Button
                            variant="raised"
                            size="small"
                            color="primary"
                            className={`${classes.noPad} ${classes.whiteText}`}
                            value="Try it"
                          >
                            Try it
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} className={classes.noPad} />
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
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );

    const transactions =
      this.state.data && this.state.data.length >= 0 ? table : circularProgress;

    return <Fragment>{transactions}</Fragment>;
  }

  render() {
    const { classes } = this.props;
    let successSnackbar =
      this.props.successMessage !== "" ? (
        <SuccessSnackbar
          successMessage={this.props.successMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let errorSnackbar =
      this.props.errorMessage !== "" ? (
        <ErrorSnackbar
          errorMessage={this.props.errorMessage}
          onClearToast={this.props.onClearToast}
        />
      ) : null;
    let loadingSnackbar =
      this.props.notifyLoading !== "" ? <LoadingSnackbar /> : null;

    return (
      <Fragment>
        {successSnackbar}
        {errorSnackbar}
        {loadingSnackbar}
        <Grid container="container">
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="Test"
              cardSubtitle="List of all the tests available to you to attempt"
              headerColor="blue"
              content={this.getCardContent()}
            />
          </ItemGrid>
        </Grid>
      </Fragment>
    );
  }
}

Stats.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    tests: state.test.tests,
    isFetchTestListInProgress: state.test.isFetchTestListInProgress,
    successMessage: state.notify.success,
    errorMessage: state.notify.error,
    notifyLoading: state.notify.loading,
    notifyClear: state.notify.clear,
    currentUser: state.auth.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTestListFetch: () => dispatch(actions.fetchTestList()),
    onDeleteTest: (tests) => dispatch(actions.deleteTests(tests)),
    onClearToast: () => dispatch(notifyClear())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(testListStyle)(Stats)
);
