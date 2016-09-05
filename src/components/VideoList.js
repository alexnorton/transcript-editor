import React, { Component } from 'react';
import { Link } from 'react-router';

class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
  }

  componentDidMount() {
    fetch(`${window.apiEndpoint}/videos.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ videos: json });
      });
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.videos.map(video => (
            <li key={video}>
              <Link to={video}>{video}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default VideoList;
