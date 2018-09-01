import React, {Component} from 'react';
import Slider from 'react-slick';
import {FoldingCube} from 'better-react-spinkit';

import Share from './share.jsx';

import {GetPlaylists} from '../api/user.js';
import {Init, Play} from '../api/player.js';

import {connect} from 'react-redux';

class Playlists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sharing: undefined
    };

    this.onPlay = this.onPlay.bind(this);
  }

  onPlay(playlist) {
    Init().then((player) => {
      Play(playlist);
    });
  }

  render() {
    const {playlists} = this.props;
    const {sharing} = this.state;

    let sliderSettings = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 8000,
      arrows: true,
      speed: 2000,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    let elements = [];

    if (playlists) {
      if (playlists.length && playlists.length > 0) {
        playlists.slice(0, 9).forEach((d, i) => {
          elements.push(<div className="col-md-4" key={"tracks-" + i}>
            <a style={{
                cursor: "pointer",
                textDecoration: "none"
              }} className="album-cover">
              <div className="atvImg album-container">
                <img src={d.images[0].url} className="img-responsive" alt="album-cover"/>
                <div className="atvImg-layer" data-img={d.images[0].url}></div>

                <div className="album-overlay"></div>
                <div className="album-play-button" onClick={() => this.onPlay(d)}>
                  <i className="fa fa-play-circle fa-5x" style={{
                      color: "white"
                    }}/>
                </div>
              </div>
            </a>
            <div className="album-block">
              <span className="album-block-title">{d.name}</span>
              <p className="album-block-subtitle"><i className="fa fa-share fa-lg" onClick={() => this.setState({["sharing"]: d})} style={{
              cursor: "pointer"
            }}/>
              </p>
            </div>
          </div>);
        });
      } else {
        elements.push(<div className="col-md-12" key={"empty"}>
          <div className="tabs">
            <div className="tab">
              <div className="fan-slide">
                <span>There's nothing here yet! Start by picking what you want to listen to, then hit play!</span>
              </div>
            </div>
          </div>
        </div>);
      }
    } else {
      elements.push(<div className="col-md-12" key={"loading"}>
        <div className="tabs">
          <div className="tab">
            <div className="fan-slide">
              <FoldingCube size={75} color={"#fff"} style={{
                  display: "table",
                  margin: "0 auto"
                }}/>
            </div>
          </div>
        </div>
      </div>);
    }

    return <div>
      <section className="section-padding our-clients has-parallax" id="clients">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="album-wrap recentplayed-wrap">
                <h2 className="fan-page-title">
                  <span>Your tailored playlists</span>
                </h2>
                <p className="media-subtitle">Awesome songs that are new to your ears.</p>
                {sharing && <Share image={sharing.images[0].url} playlist={sharing} onClose={() => this.setState({["sharing"]: undefined})}/>}

                <div className="row">
                  {
                    elements && elements.length > 3
                      ? <Slider {...sliderSettings}>
                          {elements}
                        </Slider>
                      : elements
                  }
                </div>

                <br/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  }
}

const mapStateToProps = function(store) {
  return {playlists: GetPlaylists()}
}

export default connect(mapStateToProps)(Playlists)
