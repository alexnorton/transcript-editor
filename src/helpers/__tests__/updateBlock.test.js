import { CharacterMetadata, ContentBlock, ContentState } from 'draft-js';
import Immutable from 'immutable';

import updateBlock from '../updateBlock';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE } from '../TranscriptEntities';

const createCharacterListFromRanges = (ranges) => {
  const list = [];

  ranges.forEach(({ from, to, value }) => {
    for (let i = from; i <= to; i += 1) {
      list[i] = Object.assign({}, value);
    }
  });

  return new Immutable.List(list);
};

const createEntity = (contentState, entity) => {
  contentState.createEntity(...entity);
  return contentState.getLastCreatedEntityKey();
};

const createEntities = (contentState, entities) => (
  entities.map(entity => createEntity(contentState, entity))
);

beforeEach(() => {
  CharacterMetadata.applyEntity = jest.fn((character, entity) =>
    Object.assign({}, character, { entity }));
});

describe('updateBlock()', () => {
  it('passes through block contents correctly', () => {
    const contentState = new ContentState();

    const entities = createEntities(contentState, [
      [TRANSCRIPT_WORD],
      [TRANSCRIPT_SPACE],
      [TRANSCRIPT_WORD],
    ]);

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: entities[0] } },
        { from: 5, to: 5, value: { entity: entities[1] } },
        { from: 6, to: 9, value: { entity: entities[2] } },
      ]),
      text: 'Hello Alex',
    });

    const { characterList, text } = updateBlock(contentBlock, contentState);

    expect(characterList.toJS()).toEqual(contentBlock.characterList.toJS());
    expect(text).toBe('Hello Alex');
  });

  it('adds new characters to the start of words', () => {
    const contentState = new ContentState();

    const entities = createEntities(contentState, [
      [TRANSCRIPT_WORD],
      [TRANSCRIPT_SPACE],
      [TRANSCRIPT_WORD],
    ]);

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: entities[0] } },
        { from: 5, to: 5, value: { entity: entities[1] } },
        { from: 6, to: 6, value: { entity: null } },
        { from: 7, to: 11, value: { entity: entities[2] } },
      ]),
      text: 'Hello aAlex!',
    });

    const { characterList, text } = updateBlock(contentBlock, contentState);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: entities[0] } },
      { from: 5, to: 5, value: { entity: entities[1] } },
      { from: 6, to: 11, value: { entity: entities[2] } },
    ]).toJS());

    expect(text).toBe('Hello aAlex!');
  });

  it('merges adjacent word entities', () => {
    const contentState = new ContentState();

    const entities = createEntities(contentState, [
      [TRANSCRIPT_WORD, 'MUTABLE', { start: 0.1, end: 0.5 }],
      [TRANSCRIPT_WORD, 'MUTABLE', { start: 0.6, end: 0.9 }],
    ]);

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: entities[0] } },
        { from: 5, to: 9, value: { entity: entities[1] } },
      ]),
      text: 'HelloAlex!',
    });

    const { characterList, text } = updateBlock(contentBlock, contentState);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 9, value: { entity: entities[0] } },
    ]).toJS());

    expect(text).toBe('HelloAlex!');

    expect(contentState.getEntity(entities[0]).data).toEqual({ start: 0.1, end: 0.9 });
  });

  it('merges adjacent space entities', () => {
    const contentState = new ContentState();

    const entities = createEntities(contentState, [
      [TRANSCRIPT_WORD],
      [TRANSCRIPT_SPACE],
      [TRANSCRIPT_WORD],
    ]);

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: entities[0] } },
        { from: 5, to: 5, value: { entity: entities[1] } },
        { from: 6, to: 6, value: { entity: entities[1] } },
        { from: 7, to: 11, value: { entity: entities[2] } },
      ]),
      text: 'Hello  Alex!',
    });

    const { characterList, text } = updateBlock(contentBlock, contentState);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: entities[0] } },
      { from: 5, to: 5, value: { entity: entities[1] } },
      { from: 6, to: 10, value: { entity: entities[2] } },
    ]).toJS());

    expect(text).toBe('Hello Alex!');
  });
});
