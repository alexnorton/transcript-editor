import Immutable from 'immutable';
import { Entity, CharacterMetadata } from 'draft-js';
import zipWith from 'lodash.zipwith';

import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from './TranscriptEntities';

const states = {
  state0(input) {
    const output = { woop: input };
    const nextState = states.state0;
    return { output, nextState };
  },
};

const run = (characters) => {
  characters.reduce(({ newCharacters, state }, character, index) => {
    const nextCharacter = characters[index + 1];

    const { nextState, output } = state(character, nextCharacter, characters);

    return {
      state: nextState,
      newCharacters: newCharacters.concat(output),
    };
  }, {
    state: states.state0,
    newCharacters: [],
  });
};

const updateBlock = (contentBlock, previousContentBlock) => {
  const characters = zipWith(
    contentBlock.text.split(''),
    contentBlock.characterList.toJS(),
    contentBlock.characterList.toJS().map((c) => Entity.get(c.entity)),
    (text, characterMetadata, entity) => ({ text, characterMetadata, entity })
  );

  run(characters);
};

export default updateBlock;
