import Immutable from 'immutable';
import { Entity, CharacterMetadata } from 'draft-js';

import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE, TRANSCRIPT_PLACEHOLDER }
  from './TranscriptEntities';

const updateBlock = contentBlock => (
  contentBlock.set('characterList', contentBlock.characterList.reduce((newList, character) => {
    // Is this the first character?
    if (!newList.isEmpty()) {
      const previousCharacter = newList.last();
      // Does the previous character have an entity?
      if (previousCharacter.entity) {
        // Does the previous character have a different entity?
        if (character.entity && previousCharacter.entity
          && character.entity !== previousCharacter.entity) {
          const entity = Entity.get(character.entity);
          const previousEntity = Entity.get(previousCharacter.entity);
          // Does the different entity have the same type?
          if (entity.type === previousEntity.type && entity !== previousEntity) {
            // Merge the entities
            Entity.mergeData(previousCharacter.entity, { end: entity.data.end });
            return newList.push(
              CharacterMetadata.applyEntity(character, previousCharacter.entity)
            );
          }
        }
      } else {
        // Set it to the entity of this character
        return newList
          .set(-1, CharacterMetadata.applyEntity(previousCharacter, character.entity))
          .push(character);
      }
    }
    return newList.push(character);
  }, new Immutable.List()))
);

export default updateBlock;
