import React, {Component} from 'react';
import {connect} from 'react-redux';
import {millisecondsToTime} from '../api/util';
import {IsTrackSaved, SaveTrack, RemoveTrack} from '../api/player';

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 100,
      diff: 0,
      interval: undefined,
      muted: false,
      isSaved: false
    };

    this.volumebar = React.createRef();
    this.updateVolume = this.updateVolume.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  onVolumeChange(e) {
    const {player} = this.props;
    let bounding = this.volumebar.current.getBoundingClientRect();
    let vol = e.nativeEvent.offsetX / bounding.width;

    if (player) {
      player.setVolume(vol);
    }

    this.setState({
      ["volume"]: vol * 100
    });
  }

  updateVolume(player) {
    player.getVolume().then(vol => {
      this.setState({
        ["volume"]: vol * 100
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const {player, state} = nextProps;

    if (player && this.props.player !== player) {
      this.updateVolume(player);
    }

    if (state && this.props.state !== state) {
      // Checking if the player is a bit redundant, but doing it anyway to be safe
      if (player) {
        // Keep track of the volume just in case
        this.updateVolume(player);
      }

      // The position has been updated, so reset the diff
      this.setState({["diff"]: 0});

      // If there was a diff counter, cancel it
      if (this.state.interval) {
        clearInterval(this.state.interval);
      }

      // If it is playing, schedule the task
      if (!state.paused) {
        let task = setInterval(() => {
          this.setState({
            ["diff"]: this.state.diff += 1000
          });
        }, 1000);

        this.setState({["interval"]: task});
      }

      // If the track has changed, check if it is saved
      let currTrack = state.track_window.current_track;

      if (currTrack && currTrack !== (this.props.state && this.props.state.track_window.current_track)) {
        this.setState({["isSaved"]: false});

        IsTrackSaved([currTrack.id]).then(res => {
          this.setState({
            ["isSaved"]: res && res[0]
          });
        });
      }
    }
  }

  render() {
    const {player, state} = this.props;
    const {volume, diff, muted, isSaved} = this.state;

    if (state && player) {
      return <div className="audio-player">
        <div id="jp_container_1" className={`jp-audio ${state.paused || "jp-state-playing"} ${ (volume === 0 || muted) && "jp-state-muted"}`} role="application" aria-label="media player">
          <div className="jp-type-playlist">

            <div className="jp-gui jp-interface flex-wrap">
              <div className="jp-controls flex-item">
                <button className="jp-previous" tabIndex="0" onClick={() => player.previousTrack()}>
                  <i className="fa fa-step-backward"></i>
                </button>
                <button className="jp-play" tabIndex="0" onClick={() => player.togglePlay()}>
                  <i className="fa fa-play"></i>
                </button>
                <button className="jp-next" tabIndex="0" onClick={() => player.nextTrack()}>
                  <i className="fa fa-step-forward"></i>
                </button>
              </div>

              <div className="jp-progress-container flex-item">
                <div className="jp-time-holder">
                  <span className="jp-current-time" role="timer" aria-label="time">{millisecondsToTime((state.position || 0) + (diff))}</span>
                  <span className="jp-duration" role="timer" aria-label="duration">{
                      state.duration
                        ? millisecondsToTime(state.duration)
                        : "00:00"
                    }</span>
                </div>

                <div className="jp-progress">
                  <div className="jp-seek-bar">
                    <div className="jp-play-bar" style={{
                        width: `${state.duration
                          ? (((state.position || 0) + (diff)) / state.duration * 100)
                          : 0}%`
                      }}>
                      <div className="bullet"></div>
                    </div>
                  </div>
                </div>
              </div>

              <a href="#" id="playlist-text">
                {
                  state.track_window && state.track_window.current_track && <div className="jp-now-playing flex-item">
                      <div className="jp-track-name">{state.track_window.current_track.name}</div>
                      <div className="jp-artist-name">
                        {state.track_window.current_track.artists.map(a => a.name).join(", ")}
                      </div>
                    </div>
                }
              </a>

              <div className="jp-toggles flex-item">
                <button className="jp-repeat" tabIndex="0" title="Save" onClick={() => {
                    if (state.track_window.current_track) {
                      this.setState({
                        ["isSaved"]: !isSaved
                      });

                      if (isSaved) {
                        RemoveTrack([state.track_window.current_track.id]);
                      } else {
                        SaveTrack([state.track_window.current_track.id]);
                      }
                    }
                  }}>
                  <i style={{
                      color: isSaved
                        ? "#00c85f"
                        : undefined
                    }} className={`fa ${isSaved
                      ? "fa-check"
                      : "fa-plus"}`}></i>
                </button>
              </div>

              <div className="jp-volume-controls flex-item">
                <button className="jp-mute" tabIndex="0" onClick={() => {
                    if (!muted) {
                      player.setVolume(0);
                    } else {
                      player.setVolume(volume / 100);
                    }

                    this.setState({
                      ["muted"]: !muted
                    })
                  }}>
                  <i className="fa fa-volume-up"></i>
                </button>

                <div className="jp-volume-bar" ref={this.volumebar} onClick={this.onVolumeChange}>
                  <div className="jp-volume-bar-value" style={{
                      width: `${muted
                        ? 0
                        : volume}%`
                    }}>
                    <div className="bullet" style={{
                        cursor: "default"
                      }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } else {
      return <div/>
    }
  }
}

const mapStateToProps = function(store) {
  return {player: store.player.player, state: store.player.state}
}

export default connect(mapStateToProps)(Player)
