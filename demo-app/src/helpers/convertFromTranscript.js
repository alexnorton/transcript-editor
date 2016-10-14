import { ContentBlock, Entity, CharacterMetadata, ContentState } from 'draft-js';
import Immutable from 'immutable';
import uuid from 'node-uuid';

const convertFromTranscript = (transcript) => {
  const contentBlocks = transcript.get('segments').map((segment, segmentIndex) =>
    new ContentBlock({
      key: segmentIndex.toString(),
      characterList: segment.get('words').map(word => {
        const entity = Entity.create(
          'TRANSCRIPT_WORD',
          'MUTABLE',
          {
            start: word.get('start'),
            end: word.get('end'),
            id: word.get('id') || uuid.v4(),
          }
        );
        return new Immutable.List(word.get('text').split('').map(() =>
          CharacterMetadata.applyEntity(
            CharacterMetadata.create(),
            entity
          )
        ));
      }).interpose(
        new Immutable.List([
          CharacterMetadata.applyEntity(
            CharacterMetadata.create(),
            Entity.create(
              'TRANSCRIPT_SPACE', 'IMMUTABLE', null
            )
          ),
        ])
      ).flatten(1),
      text: segment.get('words').map(w =>
        w.get('text')
      ).join(' '),
      data: new Immutable.Map({ speaker: segment.get('speaker') }),
    })
  );

  const contentState = ContentState.createFromBlockArray(contentBlocks);

  const speakers = transcript.get('speakers');

  return { contentState, speakers };
};

export default convertFromTranscript;
