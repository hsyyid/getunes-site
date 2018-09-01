import store from '../store';
import {NotificationManager} from 'react-notifications';

const endpoint = process.env.NODE_ENV === 'development'
  ? "http://localhost:3001"
  : "https://2kx14y75mf.execute-api.us-east-2.amazonaws.com/latest";

export function Init() {
  return new Promise((resolve) => {
    let {player} = store.getState().player;

    if (player) {
      resolve(player);
      return;
    }

    if (window.isSpotifyWebPlaybackSDKReady) {
      player = new window.Spotify.Player({
        name: 'Getunes Player',
        getOAuthToken: cb => {
          let {user} = store.getState().user;

          if (user) {
            fetch(`${endpoint}/access-token?identityId=${user.data.IdentityId}`).then(res => res.json()).then(token => {
              cb(token);
            });
          }
        }
      });

      // Error handling
      player.addListener('initialization_error', ({message}) => {
        console.error(message);
      });
      player.addListener('authentication_error', ({message}) => {
        console.error(message);
      });
      player.addListener('account_error', ({message}) => {
        console.error(message);
      });
      player.addListener('playback_error', ({message}) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener('player_state_changed', state => {
        console.log(state);
        store.dispatch({type: 'player/state', state});
      });

      // Ready
      player.addListener('ready', ({device_id}) => {
        console.log('Ready with Device ID', device_id);

        store.dispatch({type: 'player/player', player});
        store.dispatch({type: 'player/id', id: device_id});

        resolve(player);
      });

      // Not Ready
      player.addListener('not_ready', ({device_id}) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
    } else {
      resolve(undefined);
    }
  });
}

export function Play(uris) {
  let {id} = store.getState().player;
  let {user} = store.getState().user;

  if (id && user) {
    fetch(`${endpoint}/access-token?identityId=${user.data.IdentityId}`).then(res => res.json()).then(token => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({uris}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    });
  }
};

export function IsTrackSaved(ids) {
  return new Promise((resolve) => {
    let {user} = store.getState().user;

    if (user) {
      fetch(`${endpoint}/track/is-saved`, {
        method: "POST",
        body: JSON.stringify({ids, identityId: user.data.IdentityId}),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(res => {
        resolve(res);
      });
    } else {
      resolve(undefined);
    }
  });
}

export function SaveTrack(ids) {
  let {user} = store.getState().user;

  if (user) {
    fetch(`${endpoint}/track/save`, {
      method: "POST",
      body: JSON.stringify({ids, identityId: user.data.IdentityId}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => console.log("Save Tracks: " + res.status));
  }
}

export function RemoveTrack(ids) {
  let {user} = store.getState().user;

  if (user) {
    fetch(`${endpoint}/track/remove`, {
      method: "POST",
      body: JSON.stringify({ids, identityId: user.data.IdentityId}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => console.log("Removed Tracks: " + res.status));
  }
}

export function CreatePlaylist(seed) {
  let {creating} = store.getState().player;
  let {user} = store.getState().user;

  if (user && user.data) {
    if (!creating) {
      store.dispatch({type: 'player/creating'});
      NotificationManager.info("Creating your custom playlist...");

      fetch(`${endpoint}/playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({method: store.getState().user.discoveryMethod, num: 20, seed, identityId: user.data.IdentityId})
      }).then(res => res.json()).then(res => {
        store.dispatch({type: 'player/creating'});

        if (res && res.length && res.length > 0) {
          NotificationManager.success("Your custom playlist is ready!");

          // Reload the playlist list.
          store.dispatch({type: 'user/playlists', playlists: undefined});

          Init().then((player) => {
            Play(res);
          });
        } else {
          NotificationManager.error("Something went wrong!");
        }
      });
    } else {
      NotificationManager.error("Already creating a playlist!");
    }
  } else {
    NotificationManager.error("Not signed in!");
  }
}

export function reducer(state = {
  player: undefined,
  id: undefined,
  state: undefined,
  creating: false
}, action) {
  let newState;
  switch (action.type) {
    case 'player/player':
      newState = Object.assign({}, state);
      newState.player = action.player;
      return newState;
    case 'player/id':
      newState = Object.assign({}, state);
      newState.id = action.id;
      return newState;
    case 'player/state':
      newState = Object.assign({}, state);
      newState.state = action.state;
      return newState;
    case 'player/creating':
      newState = Object.assign({}, state);
      newState.creating = !state.creating;
      return newState;
    default:
      return state;
  }
}
