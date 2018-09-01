import React, {Component} from 'react';

import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Favorites from '../components/favorites.jsx';
import RecentlyPlayed from '../components/recent.jsx';
import Playlists from '../components/playlists.jsx';
import Search from '../components/search.jsx';
import Player from '../components/player.jsx';
import Overview from '../components/overview.jsx';

import {connect} from 'react-redux';

class App extends Component {
  render() {
    const {profile} = this.props;

    if (profile) {
      return (<div id="top" className="preload">
        <Header/>
        <Playlists/>
        <Favorites/>
        <RecentlyPlayed/>
        <Search/>
        <Player/>
        <Footer/>
      </div>);
    } else {
      return (<div id="top" className="preload">
        <Header/>
        <Overview/>
        <Footer/>
      </div>);
    }
  }
}

const mapStateToProps = function(store) {
  return {profile: store.user.profile}
}

export default connect(mapStateToProps)(App)
