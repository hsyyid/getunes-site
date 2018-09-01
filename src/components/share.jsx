import React, {Component} from 'react';

export default class Share extends Component {
  constructor(props) {
    super(props);

    let {playlist} = props;

    this.state = {
      message: `Check out my brand new playlist "${playlist.name}" made by @getunesio: ${playlist.external_urls.spotify}`
    };
  }

  componentDidMount() {
    window.$.magnificPopup.open({
      items: {
        src: '#team-modal-1',
        type: 'inline'
      },
      callbacks: {
        close: () => {
          this.props.onClose();
        }
      }
    });
  }

  render() {
    const {image, playlist} = this.props;
    const {message} = this.state;

    return <div id="team-modal-1" className="white-popup mfp-with-anim mfp-hide">
      <div className="row">
        <div className="col-sm-5">
          <img src={image} className="img-responsive team-modal-img" alt="pic"/>
        </div>
        <div className="col-sm-7">
          <div className="team-popup-desc">
            <h3 className="team-popup-title">Share your custom playlist!</h3>
            <h4 className="muted">{playlist.name}</h4>

            <p className="team-popup-text">
              Share your music with friends.
            </p>

            <div className="social-icons team-social">
              <ul>
                <li>
                  <a target="_blank" href={`https://www.facebook.com/dialog/share?app_id=911347379063571&display=popup&href=${encodeURI(playlist.external_urls.spotify)}&redirect_uri=https%3A%2F%2Fgetunes.github.io`}>
                    <span className="flaticon-social-1 flaticon-sm-shape shape1"></span>
                  </a>
                </li>
                {/* <li>
                  <a target="_blank" href={`fb-messenger://share?link=${encodeURI(playlist.external_urls.spotify)}&app_id=911347379063571`}>
                    <span className="flaticon-social-1 flaticon-sm-shape shape1"></span>
                  </a>
                </li> */
                }
                <li>
                  <a href={`https://twitter.com/home?status=${encodeURI(message)}`} target="_blank">
                    <span className="flaticon-social-media-1 flaticon-sm-shape shape2"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
