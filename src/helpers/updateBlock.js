import Immutable from 'immutable';
import { CharacterMetadata } from 'draft-js';

import { TRANSCRIPT_SPACE }
  from './TranscriptEntities';

const updateBlock = (contentBlock, contentState) => (
  contentBlock.characterList.reduce(({ characterList, text }, character, index) => {
    // Is this the first character?
    if (!characterList.isEmpty()) {
      const previousCharacter = characterList.last();
      // Does the previous character have an entity?
      if (previousCharacter.entity) {
        // Does the previous character have a different entity?
        if (character.entity) {
          const entity = contentState.getEntity(character.entity);
          const previousEntity = contentState.getEntity(previousCharacter.entity);
          // Does the different entity have the same type?
          if (entity.type === previousEntity.type && entity !== previousEntity) {
            // Merge the entities
            contentState.mergeEntityData(previousCharacter.entity, { end: entity.data.end });
            return {
              characterList: characterList.push(
                CharacterMetadata.applyEntity(character, previousCharacter.entity)
              ),
              text: text + contentBlock.text[index],
            };
          } else if (entity.type === TRANSCRIPT_SPACE && previousEntity.type === TRANSCRIPT_SPACE) {
            return {
              characterList,
              text,
            };
          }
        }
      } else {
        // Set it to the entity of this character
        return {
          characterList: characterList
            .set(-1, CharacterMetadata.applyEntity(previousCharacter, character.entity))
            .push(character),
          text: text + contentBlock.text[index],
        };
      }
    }
    return {
      characterList: characterList.push(character),
      text: text + contentBlock.text[index],
    };
  }, { characterList: new Immutable.List(), text: '' })
);

export default updateBlock;
