import fs from 'fs';
import path from 'path';

import Transcript from '../Transcript';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';

import Speaker from '../Speaker';

describe('validateJSON', () => {
  it('correctly validates valid transcripts', () => {
    const validTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-transcript.json'), 'utf8'
    ));

    expect(Transcript.validateJSON(validTranscript)).toBe(true);
  });

  it('correctly validates valid transcripts with GUIDs', () => {
    const validTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-transcript-with-guids.json'), 'utf8'
    ));

    expect(Transcript.validateJSON(validTranscript)).toBe(true);
  });

  it('correctly validates invalid transcript', () => {
    const invalidTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/invalid-transcript.json'), 'utf8'
    ));

    expect(() => Transcript.validateJSON(invalidTranscript)).toThrow();
  });
});

describe('fromJSON', () => {
  it('creates an instance from JSON', () => {
    const transcriptJSON = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-transcript-with-guids.json'), 'utf8'
    ));

    const transcript = Transcript.fromJSON(transcriptJSON);

    expect(transcript instanceof Transcript).toBe(true);

    expect(transcript.get('speakers').size).toBe(2);
    expect(transcript.get('speakers').get(0) instanceof Speaker).toBe(true);
    expect(transcript.get('speakers').toJS()).toEqual([
      { name: 'Barack Obama' },
      { name: null },
    ]);

    expect(transcript.get('segments').size).toBe(2);
    expect(transcript.get('segments').get(1) instanceof TranscriptSegment).toBe(true);

    expect(transcript.get('segments').get(1).toJS()).toEqual({
      speaker: 1,
      words: [
        {
          text: 'Hi',
          start: 1.53,
          end: 1.88,
          id: '74DDAC87-E7B6-4DB3-AC48-9CA5FFEDF48A',
        },
        {
          text: 'Barack.',
          start: 1.92,
          end: 2.33,
          id: '11303237-8E06-420B-87B1-1E16DF026985',
        },
      ],
    });

    const word = transcript.get('segments').get(1).get('words').get(0);
    expect(word instanceof TranscriptWord).toBe(true);
  });
});


describe('toJSON', () => {
  it('produces valid transcript JSON', () => {
    const originalTranscriptJSON = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-transcript-with-guids.json'), 'utf8'
    ));

    const transcript = Transcript.fromJSON(originalTranscriptJSON);

    const transcriptJSON = transcript.toJSON();

    expect(Transcript.validateJSON(transcriptJSON)).toBe(true);
  });
});
