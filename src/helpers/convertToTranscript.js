import Immutable from 'immutable';

import { Transcript, TranscriptSegment, TranscriptWord } from 'transcript-model';

const convertToTranscript = (contentState, speakers) => {
  const segments = contentState.getBlockMap().toArray().map((block) => {
    const words = [];

    block.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return contentState.getEntity(entityKey).getType() === 'TRANSCRIPT_WORD';
      },
      (start, end) => {
        const entity = contentState.getEntity(block.getEntityAt(start));
        const text = block.getText().substring(start, end);
        words.push(new TranscriptWord({
          start: entity.data.start,
          end: entity.data.end,
          id: entity.data.id,
          text,
        }));
      },
    );

    return new TranscriptSegment({
      words: new Immutable.List(words),
      speaker: block.data.get('speaker'),
    });
  });

  return new Transcript({
    segments: new Immutable.List(segments),
    speakers,
  });
};

export default convertToTranscript;
