import React, { Component } from 'react';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.video.addEventListener('play', () => this.startInterval());
    this.video.addEventListener('pause', () => this.stopInterval());
    // this.video.addEventListener('timeupdate', (e) => {
    //   console.log(e.srcElement.currentTime);
    //   this.props.onTimeUpdate(e.srcElement.currentTime);
    // });
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.props.onTimeUpdate(this.video.currentTime);
    }, 200);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <video
        ref={(c) => { this.video = c; }}
        src="data/videos/5018361_1_13936325_LQ.m4v"
        controls
        style={{ width: '100%' }}
      />
    );
  }
}

VideoPlayer.propTypes = {
  onTimeUpdate: React.PropTypes.func,
};

export default VideoPlayer;
