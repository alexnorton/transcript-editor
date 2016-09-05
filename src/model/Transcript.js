import Immutable from 'immutable';

import TranscriptSegment from './TranscriptSegment';
import TranscriptWord from './TranscriptWord';
import Speaker from './Speaker';

const TranscriptRecord = new Immutable.Record({
  speakers: new Immutable.Map(),
  segments: new Immutable.List(),
});

class Transcript extends TranscriptRecord {
  static fromComma(json) {
    // Create a map of Comma speaker IDs to numeric speaker IDs, e.g. S0: 0, S4: 1, ...
    const speakerIdMap = new Immutable.Map(
      json.commaSegments.segmentation.speakers.map((s, i) => [
        s['@id'], i,
      ])
    );

    const speakers = new Immutable.Map(
      json.commaSegments.segmentation.speakers.map(s =>
        [
          speakerIdMap.get(s['@id']),
          new Speaker({
            name: null,
          }),
        ]
      )
    );

    const segments = new Immutable.List(
      json.commaSegments.segmentation.segments.map((s, i) =>
        new TranscriptSegment({
          speaker: speakerIdMap.get(s.speaker['@id']),
          words: new Immutable.List(
            json.commaSegments.segments.transcriptions[i].words.map(w =>
              new TranscriptWord({
                text: w.punct,
                start: w.start,
                end: w.end,
              })
            )
          ),
        })
      )
    );

    return new Transcript({ speakers, segments });
  }
}

export default Transcript;
