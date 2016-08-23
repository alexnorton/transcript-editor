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
    // this.video.addEventListener('timeupdate', (e) => {
    //   console.log(e.srcElement.currentTime);
    //   this.props.onTimeUpdate(e.srcElement.currentTime);
    // });
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
          src="data/videos/5018361_1_13936325_LQ.m4v"
          controls
          style={{ width: '100%' }}
        />
        {this.state.currentTime}
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  onTimeUpdate: React.PropTypes.func,
};

export default VideoPlayer;
