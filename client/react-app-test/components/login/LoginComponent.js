import React, {Component} from 'react'

class LoginComponent extends Component {
  render() {
    return <div className="container">
      <div className="section">
        <div className="row">
          <div className="col s12 m8 offset-m2">
            <div className="card horizontal z-depth-5 valign-wrapper">
              <div className="card-image ">
                <img src="/img/card-main-background.png"/>
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <h3 className=" center-align">LOGIN</h3>
                  <form action="/student/login" method="post">
                    <div className="row">
                      <div className="input-field col s8 offset-s2">
                        <input required="required" type="text" className="validte" name="username" id="username" />
                        <label htmlFor="first_name">USERNAME</label>
                      </div>

                    </div>
                    <div className="row">
                      <div className="input-field col s8 offset-s2 " type="password">
                        <input required="required" type="password" className="form-control" name="password" id="password" />
                        <label htmlFor="first_name">Password</label>
                      </div>
                    </div>
                    <div className="row">
                      <button type="submit" className="btn col s8 offset-s2 white harvinThemeText">Login</button>
                    </div>
                    <div className="row">
                    <p className="col s12 l12 m12 center harvinThemeText">--OR--</p>
                    <div className="center"><a href="/student/home" className="col s12 l12 m12 harvinThemeText">Register</a></div>
                    </div>
                  </form>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
export default LoginComponent
