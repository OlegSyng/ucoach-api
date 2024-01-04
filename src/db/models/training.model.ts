import { ObjectId, type Document } from 'mongodb';
import { Nullable, Intensity } from '../../types/index.js';
import { Collections } from '../collections.js';

interface ICircuitGroup {
  title: string;
  rounds: number;
  activity: IActivity[];
}

interface IActivity {
  title: string;
  duration: number;
  trainingId: Nullable<string>; // trainingId is nullable for rest activities
}

export class Training {
  constructor(
    public title: string,
    public description: Nullable<string> = null,
    public coachId: Nullable<string> = null, // coachId is nullable for public training
    public intensity: Intensity = Intensity.None,
    public equipment: Nullable<string[]> = null, // equipment is nullable for bodyweight exercises
    public program: ICircuitGroup[],
    public _id?: ObjectId,
  ) {}
}

export const trainingsCollectionValidation: Document = {
  // collMod: Collections.Trainings, //use collMod to update existing collection validation
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'description', 'coachId', 'intensity', 'equipment', 'program'],
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
        program: {
          bsonType: 'array',
          description: 'Program must be an array of circuit groups and is required',
          minItems: 1,
          maxItems: 10,
          items: {
            bsonType: 'object',
            required: ['title', 'rounds', 'activity'],
            additionalProperties: false,
            properties: {
              title: {
                bsonType: 'string',
                description: 'Title must be a string and is required',
              },
              rounds: {
                bsonType: 'number',
                minimum: 1,
                maximum: 10,
                description: 'Rounds must be a number from 1 to 10 and is required',
              },
              activity: {
                bsonType: 'array',
                description: 'Activity must be an array of activities and is required',
                minItems: 1,
                maxItems: 20,
                items: {
                  bsonType: 'object',
                  required: ['title', 'duration', 'trainingId'],
                  additionalProperties: false,
                  properties: {
                    title: {
                      bsonType: 'string',
                      description: 'Title must be a string and is required',
                    },
                    duration: {
                      bsonType: 'number',
                      description: 'Duration must be a number and is required',
                    },
                    trainingId: {
                      bsonType: ['string', 'null'],
                      description: 'Training ID must be a string, nullable and is required',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  validationAction: 'error',
  validationLevel: 'strict',
};
