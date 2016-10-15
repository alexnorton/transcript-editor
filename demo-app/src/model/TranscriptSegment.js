import Immutable from 'immutable';

const TranscriptSegmentRecord = new Immutable.Record({
  speaker: null,
  words: new Immutable.List(),
});

class TranscriptSegment extends TranscriptSegmentRecord {

}

export default TranscriptSegment;
