/* eslint no-underscore-dangle: [0] */

import { Entity, CharacterMetadata, ContentBlock } from 'draft-js';
import Immutable from 'immutable';

import updateBlock from '../updateBlock';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from '../TranscriptEntities';

const createCharacterListFromRanges = (ranges) => {
  const list = [];

  ranges.forEach(({ from, to, value }) => {
    for (let i = from; i <= to; i += 1) {
      list[i] = Object.assign({}, value);
    }
  });

  return new Immutable.List(list);
};

beforeEach(() => {
  Entity._setEntities = (entities) => {
    Entity._entities = entities;
  };

  Entity.get = jest.fn(key => Entity._entities[key]);

  Entity.mergeData = jest.fn((key, data) => {
    Entity._entities[key].data = Object.assign(Entity._entities[key].data, data);
  });

  CharacterMetadata.create = jest.fn(() => ({}));

  CharacterMetadata.applyEntity = jest.fn((character, entity) => (
    Object.assign({}, character, { entity })
  ));

  ContentBlock.prototype.getEntityAt = function getEntityAt(index) {
    return this.characterList.get(index).entity;
  };
});

describe('updateBlock()', () => {
  it('passes through block contents correctly', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 9, value: { entity: '3' } },
      ]),
      text: 'Hello Alex',
    });

    const previousContentBlock = new ContentBlock();

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(contentBlock.characterList.toJS());
    expect(text).toBe('Hello Alex');
  });

  it('adds new characters to the start of words', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: null } },
        { from: 7, to: 11, value: { entity: '3' } },
      ]),
      text: 'Hello aAlex!',
    });

    const previousContentBlock = new ContentBlock();

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 11, value: { entity: '3' } },
    ]).toJS());

    expect(text).toBe('Hello aAlex!');
  });

  it('merges adjacent word entities', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD, data: { start: 0.1, end: 0.5 } },
      2: { type: TRANSCRIPT_WORD, data: { start: 0.6, end: 0.9 } },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 9, value: { entity: '2' } },
      ]),
      text: 'HelloAlex!',
    });

    const previousContentBlock = new ContentBlock();

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 9, value: { entity: '1' } },
    ]).toJS());

    expect(text).toBe('HelloAlex!');

    expect(Entity.get('1').data).toEqual({ start: 0.1, end: 0.9 });
  });

  it('merges adjacent space entities', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: '2' } },
        { from: 7, to: 11, value: { entity: '3' } },
      ]),
      text: 'Hello  Alex!',
    });

    const { characterList, text } = updateBlock(contentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 10, value: { entity: '3' } },
    ]).toJS());

    expect(text).toBe('Hello Alex!');
  });

  // Disabled because this is implemented in components/TranscriptEditor.js using
  // the handleBeforeInput method
  xit('prevents insertion of multiple spaces', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: null } },
        { from: 7, to: 11, value: { entity: '3' } },
      ]),
      text: 'Hello  Alex!',
    });

    const previousContentBlock = new ContentBlock();

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 10, value: { entity: '3' } },
    ]).toJS());

    expect(text).toBe('Hello Alex!');
  });

  // The below tests are disabled pending revisiting adding placeholder support

  xit('inserts a placeholder when a word at the end of a block has been deleted', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD, data: { start: 0.1, end: 0.5 } },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD, data: { start: 0.6, end: 0.9 } },
    });

    Entity.create = jest.fn(() => '4');

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
      ]),
      text: 'Hello ',
    });

    const previousContentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 9, value: { entity: '3' } },
      ]),
      text: 'Hello Alex',
      getEntityAt: jest.fn(index => this.characterList.get(index).entity),
    });

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 6, value: { entity: '4' } },
    ]).toJS());

    expect(text).toBe('Hello \u200C');
  });

  xit('inserts a placeholder when a word in the middle of a block has been deleted', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD, data: { start: 0.1, end: 0.5 } },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD, data: { start: 0.6, end: 0.9 } },
      4: { type: TRANSCRIPT_SPACE },
      5: { type: TRANSCRIPT_WORD, data: { start: 1.0, end: 1.4 } },
    });

    Entity.create = jest.fn(() => '6');

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: '2' } },
        { from: 7, to: 10, value: { entity: '5' } },
      ]),
      text: 'Hello  Alex',
    });

    const previousContentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 10, value: { entity: '3' } },
        { from: 11, to: 11, value: { entity: '2' } },
        { from: 12, to: 15, value: { entity: '5' } },
      ]),
      text: 'Hello there Alex',
    });

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 6, value: { entity: '6' } },
      { from: 7, to: 7, value: { entity: '2' } },
      { from: 8, to: 11, value: { entity: '5' } },
    ]).toJS());

    expect(Entity.create).toBeCalledWith(TRANSCRIPT_PLACEHOLDER, 'IMMUTABLE',
      { start: 0.6, end: 0.9 }
    );

    expect(text).toBe('Hello \u200C Alex');
  });

  xit('merges spaces when a placeholder has been deleted', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD, data: { start: 0.1, end: 0.5 } },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD, data: { start: 1.0, end: 1.4 } },
      4: { type: TRANSCRIPT_PLACEHOLDER, data: { start: 0.6, end: 0.9 } },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: '2' } },
        { from: 7, to: 10, value: { entity: '3' } },
      ]),
      text: 'Hello  Alex',
    });

    const previousContentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: '4' } },
        { from: 7, to: 7, value: { entity: '2' } },
        { from: 8, to: 11, value: { entity: '3' } },
      ]),
      text: 'Hello \u200C Alex',
    });

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 9, value: { entity: '3' } },
    ]).toJS());

    expect(text).toBe('Hello Alex');
  });

  xit('replaces a placeholder with a word when text has been entered', () => {
    Entity._setEntities({
      1: { type: TRANSCRIPT_WORD, data: { start: 0.1, end: 0.5 } },
      2: { type: TRANSCRIPT_SPACE },
      3: { type: TRANSCRIPT_WORD, data: { start: 1.0, end: 1.4 } },
      4: { type: TRANSCRIPT_PLACEHOLDER, data: { start: 0.6, end: 0.9 } },
    });

    const contentBlock = new ContentBlock({
      characterList: createCharacterListFromRanges([
        { from: 0, to: 4, value: { entity: '1' } },
        { from: 5, to: 5, value: { entity: '2' } },
        { from: 6, to: 6, value: { entity: '4' } },
        { from: 7, to: 11, value: { entity: null } },
        { from: 12, to: 12, value: { entity: '2' } },
        { from: 13, to: 16, value: { entity: '3' } },
      ]),
      text: 'Hello \u200Cthere Alex',
    });

    Entity.create = jest.fn(() => '5');

    const previousContentBlock = new ContentBlock();

    const { characterList, text } = updateBlock(contentBlock, previousContentBlock);

    expect(Entity.create).toBeCalledWith(TRANSCRIPT_WORD, 'IMMUTABLE',
      { start: 0.6, end: 0.9 }
    );

    expect(characterList.toJS()).toEqual(createCharacterListFromRanges([
      { from: 0, to: 4, value: { entity: '1' } },
      { from: 5, to: 5, value: { entity: '2' } },
      { from: 6, to: 10, value: { entity: '5' } },
      { from: 11, to: 11, value: { entity: '2' } },
      { from: 12, to: 15, value: { entity: '3' } },
    ]).toJS());

    expect(text).toBe('Hello there Alex');
  });
});
