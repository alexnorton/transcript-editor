import { ContentBlock, CharacterMetadata, ContentState, SelectionState, BlockMapBuilder } from 'draft-js';
import Immutable from 'immutable';
import uuidV4 from 'uuid/v4';

const convertFromTranscript = (transcript) => {
  let contentState = new ContentState();

  const contentBlocks = transcript.get('segments').map((segment, segmentIndex) =>
    new ContentBlock({
      key: segmentIndex.toString(),
      characterList: segment.get('words').map((word) => {
        contentState = contentState.createEntity(
          'TRANSCRIPT_WORD',
          'MUTABLE',
          {
            start: word.get('start'),
            end: word.get('end'),
            id: word.get('id') || uuidV4(),
          }
        );

        const entityKey = contentState.getLastCreatedEntityKey();

        return new Immutable.List(word.get('text').split('').map(() =>
          CharacterMetadata.applyEntity(
            CharacterMetadata.create(),
            entityKey
          )
        ));
      }).interpose(
        new Immutable.List([
          CharacterMetadata.applyEntity(
            CharacterMetadata.create(),
            (() => {
              contentState = contentState.createEntity(
                'TRANSCRIPT_SPACE', 'IMMUTABLE', null
              );
              return contentState.getLastCreatedEntityKey();
            })()
          ),
        ])
      ).flatten(1),
      text: segment.get('words').map(w =>
        w.get('text')
      ).join(' '),
      data: new Immutable.Map({ speaker: segment.get('speaker') }),
    })
  );

  const selectionState = SelectionState.createEmpty(contentBlocks.first().getKey());

  const blockMap = BlockMapBuilder.createFromArray(contentBlocks);

  contentState = contentState.merge({
    blockMap,
    selectionBefore: selectionState,
    selectionAfter: selectionState,
  });

  const speakers = transcript.get('speakers');

  return { contentState, speakers };
};

export default convertFromTranscript;
