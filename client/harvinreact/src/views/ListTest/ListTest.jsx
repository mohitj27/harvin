import React from 'react';
import quizStyles from '../../variables/styles/quizStyles';
import { withStyles } from 'material-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTestList } from '../../actions/';
class Test extends React.Component {
    state = {
        tests:[]
    }
    componentDidMount=()=>{
        this.props.getTestList('j')
    }
    render() {
        return (<div>
            Test


        </div>)
    }
}
const mapStateToProps = (state) => { }
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({getTestList},dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(quizStyles)(Test))