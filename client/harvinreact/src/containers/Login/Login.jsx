import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loginAction} from '../../actions'

class Login extends React.Component{
state={}
render(){
    return (<div>Login</div>)
}
}
const mapStateToProps=(state)=>{
    return {}
}
const mapDispatchToProps=(dispatch)=>{
    return bindActionCreators({loginAction},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)