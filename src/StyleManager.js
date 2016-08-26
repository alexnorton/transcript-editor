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

  setEntities(entities) {
    this.entities = entities;
    this.updateStyles();
  }

  setTime(time) {
    this.previousTime = this.time;
    this.time = time;
    this.updateStyles();
  }

  updateStyles() {
    Object.keys(this.entities).forEach(key => {
      const entity = this.entities[key];
      if (!this.previousTime || entity.data.start >= this.previousTime) {
        jss.set(
          `#word-${entity.data.uuid}`,
          entity.data.start >= this.time ? this.styles.unplayed : this.styles.played
        );
      }
    });
  }
}

export default StyleManager;
