import { CompositeDecorator } from 'draft-js';

import TranscriptEditorWord from '../components/TranscriptEditorWord';
import TranscriptEditorSpace from '../components/TranscriptEditorSpace';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE }
  from '../helpers/TranscriptEntities';

const decorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        const entityType = contentState.getEntity(entityKey).getType();
        return entityType === TRANSCRIPT_WORD;
      }, callback);
    },
    component: TranscriptEditorWord,
  },
  {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        const entityType = contentState.getEntity(entityKey).getType();
        return entityType === TRANSCRIPT_SPACE;
      }, callback);
    },
    component: TranscriptEditorSpace,
  },
]);

export default decorator;
