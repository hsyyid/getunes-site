import store from '../store';
import {NotificationManager} from 'react-notifications';

import Amplify, {Auth} from 'aws-amplify';

const identityPoolId = "us-east-2:fed5e354-8c74-46f8-87f4-ec68d664f908";
const region = "us-east-2";

const endpoint = process.env.NODE_ENV === 'development'
  ? "http://localhost:3001"
  : "https://2kx14y75mf.execute-api.us-east-2.amazonaws.com/latest";

Auth.configure({
  identityPoolId,
  region,
  mandatorySignIn: false,
  refreshHandlers: {
    developer: async () => {
      // TODO
      // const developerToken = await axios.get('/api/util/developerToken.json');
      // return {
      //     token: developerToken.data.result.token,
      //     identity_id: developerToken.data.result.identity_id,
      // };
    }
  }
});

export function LoginUser(code) {
  return new Promise((resolve) => {
    store.dispatch({type: 'user/fetching', fetching: "login"});

    fetch(`${endpoint}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({code})
    }).then(res => res.json()).then(res => {
      resolve(res);
      store.dispatch({type: 'user/fetching', fetching: "login"});

      if (res && res.cognitoIdentity) {
        store.dispatch({type: 'user/profile', profile: res.profile});
        NotificationManager.success("Logged in!");
        AuthUser(res);
      } else {
        NotificationManager.error("Something went wrong!");
      }
    });
  });
}

export function AuthUser(result) {
  Auth.federatedSignIn('developer', {
    token: result.cognitoIdentity.Token,
    identity_id: result.cognitoIdentity.IdentityId
  }).then((user) => {
    store.dispatch({type: 'user/user', user});
  }).catch((err) => {
    console.error(err);
  });
}

export function GetRecentTracks() {
  let {user, recent, fetching} = store.getState().user;

  if (!user) {
    return undefined;
  } else if (recent) {
    console.log("[GetRecentTracks]: Already have it, returning...")
    return recent;
  } else if (fetching["recent"]) {
    console.log("[GetRecentTracks]: Currently fetching, ignoring...")
    return undefined;
  } else {
    console.log("[GetRecentTracks]: Getting it...");
    store.dispatch({type: 'user/fetching', fetching: "recent"});
  }

  fetch(`${endpoint}/user/recent?identityId=${user.data.IdentityId}`, {
    method: "GET",
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => res.json()).then(res => {
    console.log("[GetRecentTracks]: Got it...");
    store.dispatch({type: 'user/fetching', fetching: "recent"});

    if (res && res.items) {
      store.dispatch({type: 'user/recent', recent: res});
      return res;
    }

    return undefined;
  });
}

export function GetFavorites() {
  let {user, fetching, favorites} = store.getState().user;

  if (!user) {
    return undefined;
  } else if (favorites) {
    console.log("[GetFavorites]: Already have it, returning...")
    return favorites;
  } else if (fetching["favorites"]) {
    console.log("[GetFavorites]: Currently fetching, ignoring...")
    return undefined;
  } else {
    console.log("[GetFavorites]: Getting it...");
    store.dispatch({type: 'user/fetching', fetching: "favorites"});
  }

  fetch(`${endpoint}/user/favorites?identityId=${user.data.IdentityId}`, {
    method: "GET",
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => res.json()).then(res => {
    console.log("[GetFavorites]: Got it...");
    store.dispatch({type: 'user/fetching', fetching: "favorites"});

    if (res && res.topTracks && res.topArtists) {
      store.dispatch({type: 'user/favorites', favorites: res});
      return res;
    }

    return undefined;
  });
}

export function GetPlaylists() {
  let {playlists, fetching, user} = store.getState().user;

  if (!user) {
    return undefined;
  } else if (playlists) {
    console.log("[GetPlaylists]: Already have it, returning...")
    return playlists;
  } else if (fetching["playlists"]) {
    console.log("[GetPlaylists]: Currently fetching, ignoring...")
    return undefined;
  } else {
    console.log("[GetPlaylists]: Getting it...");
    store.dispatch({type: 'user/fetching', fetching: "playlists"});
  }

  fetch(`${endpoint}/user/playlists/getunes?identityId=${user.data.IdentityId}`, {
    method: "GET",
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => res.json()).then(res => {
    console.log("[GetPlaylists]: Got it...");

    store.dispatch({type: 'user/playlists', playlists: res});
    store.dispatch({type: 'user/fetching', fetching: "playlists"});

    return res;
  });
}

export function SetDiscoveryMode(method) {
  store.dispatch({type: 'user/discoveryMethod', discoveryMethod: method});
}

export function SetPlayerMode(playerMode) {
  store.dispatch({type: 'user/playerMode', playerMode});
}

export function reducer(state = {
  recent: undefined,
  user: undefined,
  profile: undefined,
  playlists: undefined,
  discoveryMethod: "spotify",
  playerMode: "browser",
  favorites: undefined,
  fetching: {}
}, action) {
  let newState;
  switch (action.type) {
    case 'user/user':
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case 'user/favorites':
      newState = Object.assign({}, state);
      newState.favorites = action.favorites;
      return newState;
    case 'user/profile':
      newState = Object.assign({}, state);
      newState.profile = action.profile;
      return newState;
    case 'user/discoveryMethod':
      newState = Object.assign({}, state);
      newState.discoveryMethod = action.discoveryMethod;
      return newState;
    case 'user/playerMode':
      newState = Object.assign({}, state);
      newState.playerMode = action.playerMode;
      return newState;
    case 'user/recent':
      newState = Object.assign({}, state);
      newState.recent = action.recent;
      return newState;
    case 'user/playlists':
      newState = Object.assign({}, state);
      newState.playlists = action.playlists;
      return newState;
    case 'user/fetching':
      {
        newState = Object.assign({}, state);
        let type = action.fetching;
        newState.fetching[type] = !state.fetching[type];
        return newState;
      }
    default:
      return state;
  }
}
