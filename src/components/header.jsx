import React, {Component} from 'react';
import Avatar from 'react-avatar';
import {Link} from 'react-router-dom';

import {SetDiscoveryMode, SetPlayerMode, LogOut} from '../api/user.js';
import {getGreeting} from '../api/util.js';

import {connect} from 'react-redux';

class Header extends Component {
  constructor(props) {
    super(props);

    this.navbar = React.createRef();
    this.startElement = React.createRef();

    this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      open: false,
      settingsOpen: false
    };
  }

  handleScroll() {
    let element = this.navbar.current;

    let bounding = this.startElement.current.getBoundingClientRect();
    let top = bounding.top + document.body.scrollTop;
    let windowsScrollTop = window.pageYOffset;

    if (windowsScrollTop >= top) {
      element.classList.add("menu-is-scrolling");
    } else {
      element.classList.remove("menu-is-scrolling");
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const {discoveryMethod, playerMode, profile, login} = this.props;
    const {open, settingsOpen} = this.state;
    let navbar = undefined;

    if (profile) {
      navbar = <ul className="nav navbar-nav navbar-right toggle-menu">
        <li className={`animated dropdown ${settingsOpen && "open"}`}>
          <a onClick={() => this.setState({
              ["settingsOpen"]: !settingsOpen
            })} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{
              cursor: "pointer"
            }}>
            <i className="fa fa-cog fa-lg"/>
          </a>
          <ul className="dropdown-menu">
            <li>
              <h6 className="dropdown-header">Discovery Mode</h6>
            </li>
            <li>
              <a onClick={() => SetDiscoveryMode("related")} style={{
                  color: discoveryMethod === "related"
                    ? "#00BA5F"
                    : undefined,
                  cursor: "pointer"
                }}>Related Songs</a>
            </li>
            <li>
              <a onClick={() => SetDiscoveryMode("other")} style={{
                  color: discoveryMethod === "other"
                    ? "#00BA5F"
                    : undefined,
                  cursor: "pointer"
                }}>Artist Associated</a>
            </li>
            <li>
              <a onClick={() => SetDiscoveryMode("spotify")} style={{
                  color: discoveryMethod === "spotify"
                    ? "#00BA5F"
                    : undefined,
                  cursor: "pointer"
                }}>Spotify</a>
            </li>
            <li>
              <h6 className="dropdown-header">Player Mode</h6>
            </li>
            <li>
              <a onClick={() => SetPlayerMode("browser")} style={{
                  color: playerMode === "browser"
                    ? "#00BA5F"
                    : undefined,
                  cursor: "pointer"
                }}>Browser</a>
            </li>
            <li>
              <a onClick={() => SetPlayerMode("spotify")} style={{
                  color: playerMode === "spotify"
                    ? "#00BA5F"
                    : undefined,
                  cursor: "pointer"
                }}>Spotify</a>
            </li>
          </ul>
        </li>
        <li className="animated dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{
              paddingTop: "10px",
              cursor: "pointer"
            }}>
            {
              profile.images && profile.images.length > 0
                ? <img src={profile.images[0].url} className="img-circle" style={{
                      width: "30px"
                    }}/>
                : <Avatar round={true} maxInitals={2} name={profile.display_name || profile.id} size={30}/>
            }
          </a>

          <ul className="dropdown-menu">
            <li>
              <a onClick={() => LogOut()} style={{
                  cursor: "pointer"
                }}>Log out</a>
            </li>
          </ul>
        </li>
      </ul>
    } else {
      navbar = <ul className="nav navbar-nav navbar-right toggle-menu">
        {
          !login && <li className="animated">
              <a href={`https://accounts.spotify.com/en/authorize?client_id=3dc46b1fb52047cfba916da8c599d014&response_type=code&redirect_uri=${process.env.NODE_ENV === 'development'
                  ? "http:%2F%2Flocalhost:3000"
                  : "https:%2F%2Fgetunes.github.io"}%2Fauth&scope=user-read-private%20user-read-email%20%20playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private%20%20user-read-currently-playing%20user-modify-playback-state%20user-read-playback-state%20%20user-top-read%20user-read-recently-played%20%20user-library-read%20user-library-modify%20streaming%20user-read-birthdate%20app-remote-control`}>
                {"Login "}
                <i className="fa fa-spotify fa-lg"/>
              </a>
            </li>
        }
      </ul>
    }

    return <div>
      <nav className="navbar navbar-default navbar-fixed-top js-on-scroll" ref={this.navbar}>
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false" onClick={() => this.setState({
                ["open"]: !open
              })}>
              <span className="flaticon-interface"></span>
            </button>
            <Link className="navbar-brand" to="/" style={{
                color: "white",
                fontSize: "40px"
              }}>
              getunes
            </Link>
          </div>
          <div className={`collapse navbar-collapse ${open && "in"}`} id="bs-example-navbar-collapse-1">
            {navbar}
          </div>
        </div>
      </nav>

      <header className="slider-bg" id="slider">
        <div className="container">
          <div className="row">
            <div className="col-md-12 clearfix">
              <div className="slider-wrap">
                <div className="header-slide">
                  <div className="hero-wrap">
                    <div className="no-overflow">
                      <h1 className="hero-title" ref={this.startElement}>
                        {
                          profile && profile.display_name
                            ? `Good ${getGreeting()}, ${profile.display_name.split(" ")[0]}`
                            : profile
                              ? `Good ${getGreeting()}, ${profile.id}`
                              : "New music. All day, every day."
                        }
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  }
}

const mapStateToProps = function(store) {
  return {discoveryMethod: store.user.discoveryMethod, playerMode: store.user.playerMode, profile: store.user.profile, login: store.user.fetching.login}
}

export default connect(mapStateToProps)(Header)
