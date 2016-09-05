import { ContentBlock, Entity, CharacterMetadata, ContentState } from 'draft-js';
import Immutable from 'immutable';
import uuid from 'node-uuid';

const convertFromTranscript = (transcript) => {
  const contentBlocks = transcript.get('segments').map((s, i) =>
    new ContentBlock({
      key: i.toString(),
      characterList: s.get('words').map(w => {
        const entity = Entity.create(
          'TRANSCRIPT_WORD',
          'MUTABLE',
          { start: w.get('start'), end: w.get('end'), uuid: uuid.v4() }
        );
        return new Immutable.List(w.get('text').split('').map(() =>
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
      text: s.get('words').map(w =>
        w.get('text')
      ).join(' '),
      data: new Immutable.Map({ speaker: s.get('speaker') }),
    })
  );

  const contentState = ContentState.createFromBlockArray(contentBlocks);

  return contentState;
};

export default convertFromTranscript;
