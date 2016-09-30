import Immutable from 'immutable';
import { Entity, CharacterMetadata } from 'draft-js';
import zipWith from 'lodash.zipwith';

import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from './TranscriptEntities';

const states = {
  state0: {
    defaultTransition: {
      output: ({ currentContentStateCharacter }) => (
        currentContentStateCharacter
      ),
      nextState: 'state0',
    },
    transitions: [
      {
        condition: ({ currentContentStateCharacter }) => (
          !currentContentStateCharacter.entity
        ),
        output: ({
          currentContentStateCharacter,
          currentContentStateNextCharacter,
        }) => ({
          characterMetadata: CharacterMetadata.applyEntity(
            currentContentStateCharacter.characterMetadata,
            currentContentStateNextCharacter.characterMetadata.entity,
          ),
          text: currentContentStateCharacter.text,
        }),
        nextState: 'state0',
      },
      {
        condition: ({
          currentContentStateCharacter,
          currentContentStateNextCharacter,
        }) => (
          currentContentStateCharacter.entity.type === TRANSCRIPT_SPACE
            && !currentContentStateNextCharacter.entity
            && currentContentStateNextCharacter.text === ' '
        ),
        output: ({ currentContentStateCharacter }) => (
          currentContentStateCharacter
        ),
        nextState: 'state1',
      },
      {
        condition: ({
          currentContentStateCharacter,
          newCharacters,
        }) => (
          currentContentStateCharacter.entity.type === newCharacters[newCharacters.length - 1].entity
        )
      }
    ],
  },
  state1: {
    defaultTransition: {
      output: () => ([]),
      nextState: 'state0',
    },
    transitions: [],
  },
};

const initialState = 'state0';

const run = characters => (
  // iterate over characters
  characters.reduce(({ newCharacters, state }, character, index) => {
    console.log(character, state);

    const nextCharacter = characters[index + 1];

    const inputObject = {
      currentContentStateCharacter: character,
      currentContentStateNextCharacter: nextCharacter,
      previousContentStateCharacter: null,
      newContentStateLastCharacter: newCharacters[newCharacters.length - 1],
    };

    const transition = states[state].transitions.find(t => t.condition(inputObject))
      || states[state].defaultTransition;

    const output = transition.output(inputObject);

    const nextState = transition.nextState;

    return {
      state: nextState,
      newCharacters: newCharacters.concat(output),
    };
  }, {
    state: initialState,
    newCharacters: [],
  })
);

const updateBlock = (contentBlock, previousContentBlock) => {
  const characters = zipWith(
    contentBlock.text.split(''),
    contentBlock.characterList.toJS(),
    contentBlock.characterList.toJS().map(c => Entity.get(c.entity)),
    (text, characterMetadata, entity) => ({ text, characterMetadata, entity })
  );

  // console.log(characters);

  const { newCharacters } = run(characters);

  return {
    characterList: new Immutable.List(
      newCharacters.map(({ characterMetadata }) => characterMetadata)
    ),
    text: newCharacters.map(({ text }) => text).join(''),
  };
};

export default updateBlock;
