
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Dialog, { DialogTitle ,DialogActions,DialogContent} from 'material-ui/Dialog';
import PersonIcon from 'material-ui-icons/Person';
import AddIcon from 'material-ui-icons/Add';
import Typography from 'material-ui/Typography';
import blue from 'material-ui/colors/blue';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  handleCancel = () => {
    this.props.onClose();
  };

  handleOk = () => {
    this.props.onClose();
  };


  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;
    return (
      <Dialog 
      onClose={this.handleClose} 
      aria-labelledby="simple-dialog-title" 
      disableBackdropClick
      disableEscapeKeyDown {...other}>
        <DialogTitle id="simple-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>{this.props.children} </DialogContent>   
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

SimpleDialogWrapped.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};


class SimpleDialogDemo extends React.Component {
  state = {
    open: false,
    selectedValue: emails[1],
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    return (
      <div>
          <Button variant="fab" mini color="secondary" aria-label="add" onClick={this.handleClickOpen}>
          <AddIcon />
          </Button>
        <SimpleDialogWrapped
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onClose={this.handleClose}
          children={this.props.children}
          title={this.props.title}
        />
      </div>
    );
  }
}

export default SimpleDialogDemo;