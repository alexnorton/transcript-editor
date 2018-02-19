import Immutable from 'immutable';
import { CompositeDecorator, EditorState } from 'draft-js';

import TranscriptEditorWord from '../components/TranscriptEditorWord';
import TranscriptEditorSpace from '../components/TranscriptEditorSpace';
import TranscriptEditorSpanUnplayed from '../components/TranscriptEditorSpanUnplayed';
import TranscriptEditorSpanPlayed from '../components/TranscriptEditorSpanPlayed';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE } from '../helpers/TranscriptEntities';

const wordsDecorator = new CompositeDecorator([
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

export const withWords = editorState => EditorState.set(editorState, { decorator: wordsDecorator });

const PLAYED = 'PLAYED';
const UNPLAYED = 'UNPLAYED';

class TimeDecorator {
  constructor(time) {
    this.time = time;
    this.components = {
      [PLAYED]: TranscriptEditorSpanPlayed,
      [UNPLAYED]: TranscriptEditorSpanUnplayed,
    };
  }

  getDecorations(contentBlock, contentState) {
    const characterList = contentBlock.getCharacterList();

    if (
      !characterList.first().entity ||
      contentState.getEntity(characterList.last().entity).data.end < this.time
    ) {
      return new Immutable.List(new Array(characterList.size).fill(PLAYED));
    }

    if (contentState.getEntity(characterList.first().entity).data.start > this.time) {
      return new Immutable.List(new Array(characterList.size).fill(UNPLAYED));
    }

    const index = characterList.findIndex(character =>
      contentState.getEntity(character.entity).data.start > this.time);

    if (index === -1) {
      return new Immutable.List(new Array(characterList.size).fill(PLAYED));
    }

    /* eslint-disable function-paren-newline */
    return new Immutable.List(
      new Array(characterList.size).fill(PLAYED, 0, index - 1).fill(UNPLAYED, index - 1),
    );
    /* eslint-enable */
  }

  getComponentForKey(key) {
    return this.components[key];
  }

  // eslint-disable-next-line class-methods-use-this
  getPropsForKey() {
    return null;
  }
}

export const withTime = (editorState, time) =>
  EditorState.set(editorState, { decorator: new TimeDecorator(time) });
