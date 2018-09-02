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
              <p className="section-subtitle" style={{
                  fontWeight: 400
                }}>getunes finds
                <strong style={{
                    fontWeight: 700
                  }}>{" new "}</strong>
                music you'll love.
              </p>
              <p className="section-subtitle-thin">
                getunes uses the power of Spotify to find new music just for you. It will
                <strong style={{
                    fontWeight: 700
                  }}>{" never"}
                </strong>:
                <ul>
                  <li>
                    recommend the same song twice
                  </li>
                  <li>
                    recommend a song already in your library
                  </li>
                </ul>
              </p>
              <p className="section-subtitle-thin">
                getunes utilizes three methods of finding music:
                <ul>
                  <li>
                    <strong style={{
                        fontWeight: 500
                      }}>{"Related Songs"}
                    </strong>: finds public playlists created by other users with similar music taste
                  </li>
                  <li>
                    <strong style={{
                        fontWeight: 500
                      }}>{"Artist Associated"}
                    </strong>: finds albums the artist is associated with
                  </li>

                  <li>
                    <strong style={{
                        fontWeight: 500
                      }}>{"Spotify"}
                    </strong>: gets personalized recommendations using Spotify's API
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  }
}
