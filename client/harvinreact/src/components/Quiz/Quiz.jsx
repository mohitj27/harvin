import React ,{Component}from 'react';
import { withStyles, Button } from 'material-ui';
import cx from 'classnames';
import PropTypes from 'prop-types';


class Quiz extends Component{
    state={}
    render(){
        return (<div>QUIZ</div>);
    }
}
Quiz.PropTypes={
    quiz:PropTypes.object.isRequired,
}

export default Quiz