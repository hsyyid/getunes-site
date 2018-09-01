import React, {Component} from 'react';
import {connect} from 'react-redux';

import {FoldingCube} from 'better-react-spinkit';
import {CreatePlaylist} from '../api/player.js';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: undefined,
      searchResults: undefined,
      type: "Artist",
      isSearching: false
    };

    this.onSearch = this.onSearch.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onPlay(seed) {
    CreatePlaylist(seed);
  }

  onChange(e) {
    const {isSearching} = this.state;

    if (!isSearching) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  onSearch(e) {
    const {user} = this.props;
    const {search, type} = this.state;
    console.log("Search term: " + search);

    if (user) {
      this.setState({["isSearching"]: true});

      fetch(`http://localhost:3001/search?q=${search}&type=${type}&identityId=${user.data.IdentityId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }).then(res => res.json()).then(res => {
        this.setState({["searchResults"]: res});
        this.setState({["isSearching"]: false});
      });
    }
  }

  render() {
    const {searchResults, isSearching, type} = this.state;
    const types = ["Track", "Album", "Artist"];
    let results = [];
    let unused = [];

    if (searchResults) {
      for (let i = 0; i < searchResults.length; i++) {
        let data = searchResults[i];
        let {images} = type === "Track"
          ? data.album
          : data;

        results.push(<div className="audio-wrap" key={`result-${i}`}>
          <div className="col-xs-12 col-sm-4 col-md-3">
            <div className="audio-play-btn">
              <img src={images && images[0] && images[0].url} style={{
                  width: "100px"
                }}/>
            </div>
          </div>
          <div className="col-xs-12 col-sm-7 col-md-8">
            <div className="audio-title">
              <span>{data.name}</span>
              <p>{type !== "Artist" && data.artists.map(a => a.name).join(", ")}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-1 col-md-1">
            <div style={{
                textAlign: "right",
                fontWeight: 100
              }}>
              <a style={{
                  cursor: "pointer",
                  textDecoration: "none"
                }} onClick={() => this.onPlay({
                  artistId: type === "Artist"
                    ? data.id
                    : data.artists[0].id,
                  artistName: type === "Artist"
                    ? data.name
                    : data.artists[0].name,
                  song: type === "Track"
                    ? {
                      songName: data.name,
                      songId: data.id
                    }
                    : undefined,
                  album: type === "Album"
                    ? {
                      albumName: data.name
                    }
                    : undefined
                })}>
                <span className="flaticon-play flaticon-sm"></span>
              </a>
            </div>
          </div>
        </div>);

        results.push(<div className="clearfix" key={`clearfix-${i}`}></div>);
      }
    }

    types.filter(t => t !== type).forEach(x => {
      unused.push(<li key={x}>
        <a onClick={() => {
            this.setState({["type"]: x});
            this.setState({["searchResults"]: undefined});
          }}>{x}</a>
      </li>);
    });

    return <div>
      <section className="section-padding our-media has-parallax" id="media">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="media-title">
                <span>Something else?</span>
              </h2>
              <p className="media-subtitle">
                Get fresh beats based on any artists or tracks.
              </p>
            </div>
            <div className="btn-position">
              <input type="text" id="search" name="search" className="form-control form-width" placeholder="Search..." onChange={this.onChange} style={{
                  borderRadius: "40px"
                }}/>
              <div className="navbar navbar-poop tab-position">
                <ul className="nav navbar-nav nav-tabs">
                  <li className="tabset-left active dropdown" role="presentation" style={{
                      borderRadius: "40px",
                      marginRight: "50px"
                    }}>
                    <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup={true} aria-expanded={false}>
                      {type + " "}
                      <i className="fa fa-caret-down fa-lg"/>
                    </a>

                    <ul className="dropdown-menu" style={{
                        cursor: "pointer"
                      }}>
                      {unused}
                    </ul>
                  </li>
                  {
                    <li className="tabset-right" role="presentation" style={{
                          borderRadius: "40px"
                        }}>
                        {
                          isSearching
                            ? <FoldingCube size={50} color={"#19E68C"}/>
                            : <a style={{
                                  cursor: "pointer"
                                }} onClick={this.onSearch}>Search</a>
                        }
                      </li>
                  }
                </ul>
              </div>

              <div className="tab-content">
                <div role="tabpanel" className="tab-pane audio-tab active" id="audio">
                  {results}
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
  return {creatingPlaylist: store.player.creating, user: store.user.user}
}

export default connect(mapStateToProps)(Search)
