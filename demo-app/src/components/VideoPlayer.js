import PropTypes from 'prop-types';
import React, { Component } from 'react';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
    this.setState({
      currentTime: this.video.currentTime,
    });
    this.props.onTimeUpdate(this.video.currentTime);
  }

  render() {
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
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string,
  onTimeUpdate: PropTypes.func,
};

export default VideoPlayer;
