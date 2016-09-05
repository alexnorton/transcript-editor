import Immutable from 'immutable';

const TranscriptSegmentRecord = new Immutable.Record({
  speaker: null,
  words: new Immutable.List(),
});

class Transcript extends TranscriptSegmentRecord {

}

export default Transcript;
