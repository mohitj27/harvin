import React from "react";
import PropTypes from "prop-types";
import logo from "../../assets/img/loginHosp.jpg";
import {
    withStyles,
    Grid,
    Paper,
    Card,
    CardContent,
    Typography,
    Button,
    CardActions,
} from "material-ui";
import Quiz from "../../components/Quiz/Quiz";
import { EditorState } from "draft-js";
import { RegularCard, ItemGrid } from "../../components";
import homeStyles from "../../variables/styles/homeStyles";

class Home extends React.Component {
    state = {
        value: 0
    };
    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render() {
        const { classes } = this.props
        return (<div className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={8} md={8}>
                    <Paper>
<span style={{color:'white'}}>.</span>
                        <Grid container justify="center">
                            <Grid item xs={4} sm={3} md={2} className={classes.profileContainer}>
                                <img src={logo} alt="" style={{ width: '100%' }} className={classes.profileImage} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item lgDown sm={4} md={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.notificationsTitle} >
                             Notifications
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">See all.. </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(homeStyles)(Home);
