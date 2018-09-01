import React, {Component} from 'react';

export default class Overview extends Component {
  render() {
    return <section className="section-padding about clearfix" id="about">
      <img src={require("../images/particles/triangle_1.svg")} alt="triangle" className="particle pos_a" data-rellax-speed="2" data-rellax-percentage="0.5"/>
      <img src={require("../images/particles/triangle_1.svg")} alt="triangle" className="particle pos_c" data-rellax-speed="2" data-rellax-percentage="0.5"/>
      <img src={require("../images/particles/triangle_4.svg")} alt="triangle" className="particle pos_d" data-rellax-speed="1" data-rellax-percentage="0.5"/>
      <img src={require("../images/particles/triangle_5.svg")} alt="triangle" className="particle pos_e" data-rellax-speed="3" data-rellax-percentage="0.5"/>
      <img src={require("../images/particles/circle_1.svg")} alt="circle" className="particle pos_f" data-rellax-speed="4" data-rellax-percentage="0.5"/>
      <img src={require("../images/particles/circle_2.svg")} alt="circle" className="particle pos_g" data-rellax-speed="2" data-rellax-percentage="0.5"/>
      <img src={require("../images/particles/circle_5.svg")} alt="circle" className="particle pos_i" data-rellax-speed="1" data-rellax-percentage="0.5"/>

      <div className="container">
        <div className="row">
          <div className="band-wrap">
            <div className="col-md-8 col-md-pull">
              <h2 className="section-title">What's getunes?</h2>
              <p className="section-subtitle">It was during a winter season that the idea of Duotone was conceived. Lewis had called in John to sing a jingle for him.</p>
              <p className="section-subtitle-thin">The restless Lewis began crooning something while strumming on his guitar, John felt inspired to jam with an alaap, and the result: the seamless fusion of Eastern and Western sounds that has become the quintessential characteristic of the Raaga.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  }
}
