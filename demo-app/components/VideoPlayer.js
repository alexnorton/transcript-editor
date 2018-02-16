import PropTypes from 'prop-types';
import React, { Component } from 'react';

class VideoPlayer extends Component {
  componentDidMount() {
    this.video.addEventListener('play', () => this.startInterval());
    this.video.addEventListener('pause', () => this.stopInterval());
    this.video.addEventListener('seeked', () => this.updateTime());
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.updateTime();
    }, 100);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  updateTime() {
    if (this.props.onTimeUpdate) {
      this.props.onTimeUpdate(this.video.currentTime);
    }
  }

  render() {
    /* eslint-disable jsx-a11y/media-has-caption */
    return (
      <div>
        <video
          ref={(c) => { this.video = c; }}
          src={this.props.src}
          controls
          style={{ width: '100%' }}
        />
      </div>
    );
    /* eslint-enable */
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  onTimeUpdate: PropTypes.func,
};

VideoPlayer.defaultProps = {
  onTimeUpdate: null,
};

export default VideoPlayer;
