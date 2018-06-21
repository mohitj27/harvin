import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/img/loginHosp.jpg';
import {
    withStyles,
    Grid,
    Paper,
    Card,
    CardContent,
    Typography,
    Button,
    CardActions,
    IconButton,
} from 'material-ui';
import homeStyles from '../../variables/styles/homeStyles';
import { Edit } from "material-ui-icons";
import axios from 'axios';
import url from '../../config/'

class Home extends React.Component {
    state = {
        value: 0,
    };
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };
    handleEditProfileImage = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                profileImage: file,
                profileImageName: file.name,
            }, () => {


                let form = new FormData();
                form.append('profileImage', this.state.profileImage)
                axios.put(`${url}/student/profile`, form).then((res) => { console.log(res) }).catch((err) => { console.log(err); });
            });
        }
        try {
            reader.readAsDataURL(file)

        } catch (error) {
            console.log(error);
        }

    }

    render() {
        const { classes } = this.props;
        return (<div className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={8} md={8}>
                    <Paper>
                        <span style={{ color: 'white' }}>.</span>
                        <Grid container justify="center">
                            <Grid item xs={4} sm={3} md={2} className={classes.profileContainer}>
                                <img src={logo} alt="" style={{ width: '100%' }} className={classes.profileImage} />
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="raised-button-file"
                                    type="file"
                                    name='profileImage'
                                    onChange={this.handleEditProfileImage}
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="raised-button-file">
                                    <IconButton component="span" color="default">
                                        <Edit />
                                    </IconButton>
                                </label>
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(homeStyles)(Home);
