import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

import footerStyle from '../../variables/styles/footerStyle';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{' '}
            <a href="http://radixhealthcare.org" className={classes.a}>
              Radic Health Care Pvt. Ltd.
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(footerStyle)(Footer);
