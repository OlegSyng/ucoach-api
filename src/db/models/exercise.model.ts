import { ObjectId, type Document } from 'mongodb';
import { Nullable, Intensity } from '../../types/index.js';
import { Collections } from '../collections.js';

export class Exercise {
  constructor(
    public title: string,
    public description: Nullable<string> = null,
    public coachId: Nullable<string> = null, // coachId is nullable for public exercises
    public intensity: Intensity = Intensity.None,
    public videoUrl: Nullable<string> = null,
    public equipment: Nullable<string[]> = null, // equipment is nullable for bodyweight exercises
    public _id?: ObjectId,
  ) {}
}

export const excercisesCollectionValidation: Document = {
  // collMod: Collections.Exercises, //use collMod to update existing collection validation
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'description', 'coachId', 'intensity', 'videoUrl', 'equipment'],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: 'objectId',
          description: 'Id must be an ObjectId',
        },
        title: {
          bsonType: 'string',
          description: 'Title must be a string and is required',
        },
        description: {
          bsonType: ['string', 'null'],
          description: 'Description must be a string, nullable and is required',
        },
        coachId: {
          bsonType: ['string', 'null'],
          description: 'Coach ID must be string, nullable and is required',
        },
        intensity: {
          bsonType: 'number',
          minimum: 0,
          maximum: 10,
          description: 'Intensity must be a number from 0 to 10 and is required',
        },
        videoUrl: {
          bsonType: ['string', 'null'],
          description: 'Video URL must be a string, nullable and is required',
        },
        equipment: {
          bsonType: ['array', 'null'],
          description:
            'Equipment must be an array of strings representing equipmentIds from Equipment choicelist, nullable and is required',
          minItems: 1,
          maxItems: 10,
          items: {
            bsonType: 'string',
          },
        },
      },
    },
  },
  validationAction: 'error',
  validationLevel: 'strict',
};
