import Immutable from 'immutable';

const TranscriptWordRecord = new Immutable.Record({
  id: null,
  text: '',
  start: 0,
  end: 0,
});

class TranscriptWord extends TranscriptWordRecord {

}

export default TranscriptWord;
