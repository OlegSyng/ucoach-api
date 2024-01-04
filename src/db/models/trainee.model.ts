import { ObjectId, type Document } from 'mongodb';
import { Nullable } from '../../types/index.js';
import { User } from './user.model.js';
import { Collections } from '../collections.js';

type TraineeType = Pick<User, 'firstName' | 'lastName' | 'email' | '_id' | 'coachId'> & {
  userId: Nullable<string>;
};

export class Trainee implements TraineeType {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public coachId: string,
    public userId: Nullable<string> = null,
    public _id?: ObjectId,
  ) {}
}

export const traineesCollectionValidation: Document = {
  collMod: Collections.Trainees, //use collMod to update existing collection validation
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'firstName',
        'lastName',
        'email',
        'coachId',
        'userId',
      ],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: 'objectId',
          description: 'must be an ObjectId and is required',
        },
        firstName: {
          bsonType: 'string',
          description: 'First name must be a string and is required',
        },
        lastName: {
          bsonType: 'string',
          description: 'Last name must be a string and is required',
        },
        email: {
          bsonType: 'string',
          description: 'Email must be a string and is required',
        },
        coachId: {
          bsonType: 'string',
          description: 'Coach ID must be string and is required',
        },
        userId: {
          bsonType: ['string', 'null'],
          description: 'UserId must be a string, nullable and is required',
        },
      },
    },
  },
  validationAction: 'error',
  validationLevel: 'strict',
};

