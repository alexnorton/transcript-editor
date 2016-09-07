import jss from 'jss-browserify';

class StyleManager {
  constructor() {
    this.time = 0;
    this.entities = {};

    this.styles = {
      unplayed: {
        color: '#999',
      },
      played: {
        color: '#333',
      },
    };
  }

  setTranscript(transcript) {
    this.transcript = transcript;
  }

  setTime(time) {
    this.previousTime = this.time;
    this.time = time;
    this.updateStyles();
  }

  updateStyles() {
    this.transcript.segments.forEach(segment => {
      segment.words.forEach(word => {
        if (!this.previousTime || word.start >= this.previousTime) {
          jss.set(
            `#word-${word.id}`,
            word.start >= this.time ? this.styles.unplayed : this.styles.played
          );
        }
      });
    });
  }
}

export default StyleManager;
