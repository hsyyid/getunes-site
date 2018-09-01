import React, {Component} from 'react';
import Slider from 'react-slick';
import {FoldingCube} from 'better-react-spinkit';

import {connect} from 'react-redux';

import {CreatePlaylist} from '../api/player.js';
import {GetFavorites} from '../api/user.js';

class Favorites extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(seed) {
    CreatePlaylist(seed);
  }

  render() {
    const {favorites} = this.props;

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
    let artists = [];

    if (favorites) {
      let {topTracks, topArtists} = favorites;

      topTracks.slice(0, 9).forEach((d, i) => {
        songs.push(<div className="col-md-4" key={"tracks-" + i}>
          <a className="album-cover" style={{
              cursor: "default",
              textDecoration: "none"
            }}>
            <div className="atvImg album-container">
              <img src={d.album.images[0].url} className="img-responsive" alt="album-cover"/>
              <div className="atvImg-layer" data-img={d.album.images[0].url}></div>

              <div className="album-overlay"></div>
              <div className="album-play-button" style={{
                  cursor: "pointer"
                }} onClick={() => this.onClick({
                  artistId: d.artists[0].id,
                  artistName: d.artists[0].name,
                  image: d.album.images[0].url,
                  song: {
                    songId: d.id,
                    songName: d.name
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

      topArtists.slice(0, 9).forEach((d, i) => {
        artists.push(<div className="col-md-4" key={"artists-" + i}>
          <a className="album-cover" style={{
              cursor: "default",
              textDecoration: "none"
            }}>
            <div className="atvImg album-container">
              <img src={d.images[0].url} className="img-responsive" alt="artist-cover"/>
              <div className="atvImg-layer" data-img={d.images[0].url}></div>

              <div className="album-overlay"></div>
              <div className="album-play-button" style={{
                  cursor: "pointer"
                }} onClick={() => this.onClick({artistId: d.id, artistName: d.name, image: d.images[0].url})}>
                <i className="fa fa-play-circle fa-5x" style={{
                    color: "white"
                  }}/>
              </div>
            </div>
          </a>
          <div className="album-block">
            <span className="album-block-title">{d.name}</span>
          </div>
        </div>);
      });
    }

    return <div>
      <section className="section-padding album" id="album">
        <img src={require("../images/particles/triangle_1.svg")} alt="triangle" className="particle pos_c" data-rellax-speed="3" data-rellax-percentage="0.5"/>
        <img src={require("../images/particles/triangle_1.svg")} alt="triangle" className="particle pos_b" data-rellax-speed="2" data-rellax-percentage="0.5"/>
        <img src={require("../images/particles/triangle_4.svg")} alt="triangle" className="particle pos_d" data-rellax-speed="1" data-rellax-percentage="0.5"/>
        <img src={require("../images/particles/triangle_5.svg")} alt="triangle" className="particle pos_e" data-rellax-speed="4" data-rellax-percentage="0.5"/>
        <img src={require("../images/particles/circle_1.svg")} alt="circle" className="particle pos_a" data-rellax-speed="2" data-rellax-percentage="0.5"/>
        <img src={require("../images/particles/circle_2.svg")} alt="circle" className="particle pos_f" data-rellax-speed="3" data-rellax-percentage="0.5"/>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="album-wrap">
                <h2 className="album-title">
                  <span>Your favorites</span>
                </h2>
                <p className="album-subtitle">
                  Feeling like something special?
                  <p style={{
                      fontSize: "23px",
                      fontWeight: 300
                    }}>
                    Find more like these with just one click.
                  </p>
                </p>
                {
                  songs.length > 0
                    ? <div className="row">
                        <Slider {...sliderSettings}>
                          {songs}
                        </Slider>
                      </div>
                    : <FoldingCube size={75} color={"#bababb"} style={{
                          display: "table",
                          margin: "0 auto"
                        }}/>
                }
                <br style={{
                    lineHeight: "60px"
                  }}/>
                <div className="row">
                  <Slider {...sliderSettings}>
                    {artists}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  }
}

const mapStateToProps = function(store) {
  return {favorites: GetFavorites()}
}

export default connect(mapStateToProps)(Favorites)
