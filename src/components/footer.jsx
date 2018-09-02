import React, {Component} from 'react';

export default class Footer extends Component {
  render() {
    return <div>
      <footer className="section-padding has-parallax" style={{
          padding: "50px 0"
        }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="social-icons">
                <ul>
                  <li>
                    <a href="https://twitter.com/getunesio">
                      <span className="flaticon-social-media-1 flaticon-sm-shape shape2"></span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12">
              <div className="shape-line">
                <img src={require("../images/shape-line.png")} className="img-responsive" alt="svg-style-line"/>
              </div>
            </div>
            <div className="col-md-12">
              <div className="address">
                <p>{"Made with "}
                  <i className="fa fa-heart"/> {" by HassanS6000"}</p>
                <h5>Copyright © 2018 Negafinity</h5>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  }
}
