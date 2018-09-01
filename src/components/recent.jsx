import React, {Component} from 'react';
import Slider from 'react-slick';
import {FoldingCube} from 'better-react-spinkit';

import {CreatePlaylist} from '../api/player.js';
import {GetRecentTracks} from '../api/user.js';

import {connect} from 'react-redux';

class RecentlyPlayed extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(seed) {
    CreatePlaylist(seed);
  }

  render() {
    const {recentTracks} = this.props;

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

    let songs = [];

    if (recentTracks) {
      recentTracks.items.slice(0, 9).map(t => t.track).forEach((d, i) => {
        songs.push(<div className="col-md-4" key={"tracks-" + i}>
          <a style={{
              textDecoration: "none"
            }} className="album-cover">
            <div className="atvImg album-container">
              <img src={d.album.images[0].url} className="img-responsive" alt="album-cover"/>
              <div className="atvImg-layer" data-img={d.album.images[0].url}></div>

              <div className="album-overlay"></div>
              <div className="album-play-button" onClick={() => this.onClick({
                  artistId: d.artists[0].id,
                  artistName: d.artists[0].name,
                  song: {
                    songName: d.name,
                    songId: d.id
                  }
                })}>
                <i className="fa fa-play-circle fa-5x" style={{
                    color: "white"
                  }}/>
              </div>
            </div>
          </a>
          <div className="album-block">
            <span className="album-block-title">{d.name}</span>
            <p className="album-block-subtitle">{d.artists.map(x => x.name).join(", ")}</p>
          </div>
        </div>);
      });
    }

    return <div>
      <section className="section-padding event has-parallax" id="events">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="album-wrap recentplayed-wrap">
                <h2 className="event-title">
                  <span>Recently played</span>
                </h2>
                <p className="event-subtitle">Let's keep the party going!</p>

                {
                  songs.length > 0
                    ? <div className="row">
                        <Slider {...sliderSettings}>
                          {songs}
                        </Slider>
                      </div>
                    : <FoldingCube size={75} color={"#ffce80"} style={{
                          display: "table",
                          margin: "0 auto"
                        }}/>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  }
}

const mapStateToProps = function(store) {
  return {recentTracks: GetRecentTracks()}
}

export default connect(mapStateToProps)(RecentlyPlayed)
