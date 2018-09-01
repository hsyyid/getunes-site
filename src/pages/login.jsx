import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {FoldingCube} from 'better-react-spinkit';

import {LoginUser} from '../api/user.js';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false
    };
  }

  componentDidMount() {
    let {location} = this.props;

    if (location && location.search) {
      let code = location.search.replace("?code=", "");
      LoginUser(code).then(res => {
        this.setState({["done"]: true});
      })
    }
  }

  // TODO: Loading indicator
  render() {
    const {done} = this.state;

    if (done) {
      return <Redirect to="/"/>
    } else {
      return (<div>
        <Header/>

        <section className="testimonial clearfix has-parallax" id="testimonial">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="testimonial-space">
                  <FoldingCube size={75} color={"#0048ff"} style={{
                      display: "table",
                      margin: "0 auto"
                    }}/>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer/>
      </div>);
    }
  }
}
