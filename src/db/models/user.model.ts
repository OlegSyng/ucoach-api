import { Document, ObjectId } from 'mongodb';
import { Collections } from '../collections.js';

type WeightData = {
  date: number;
  weight: number;
};

export class User {
  constructor(
    public username: string,
    public email: string,
    public salt: string,
    public password_hash: string,
    public firstName: string | null = null,
    public lastName: string | null = null,
    public isCoach: boolean = true, //register as coach by default
    public coachId: string | null = null,
    public dateOfBirth: string | null = null,
    public weight: WeightData[] | null = null,
    public imageUrl: string | null = null,
    public _id?: ObjectId,
  ) {}
}

export const usersCollectionValidation: Document = {
  collMod: Collections.Users, //use collMod to update existing collection validation
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'username',
        'email',
        'salt',
        'password_hash',
        'firstName',
        'lastName',
        'isCoach',
        'coachId',
        'dateOfBirth',
        'weight',
        'imageUrl',
      ],
      additionalProperties: false,
      properties: {
        _id: {
          bsonType: 'objectId',
          description: 'must be an ObjectId and is required',
        },
        username: {
          bsonType: 'string',
          description: 'Username must be a string and is required',
        },
        email: {
          bsonType: 'string',
          description: 'Email must be a string and is required',
        },
        salt: {
          bsonType: 'string',
          description: 'Salt must be a string and is required',
        },
        password_hash: {
          bsonType: 'string',
          description: 'Password hash must be a string and is required',
        },
        firstName: {
          bsonType: ['string', 'null'],
          description: 'First name must be a string, nullable and is required',
        },
        lastName: {
          bsonType: ['string', 'null'],
          description: 'Last name must be a string, nullable and is required',
        },
        isCoach: {
          bsonType: 'bool',
          description: 'isCoach must be a boolean and is required',
        },
        coachId: {
          bsonType: ['string', 'null'],
          description: 'Coach ID must be a string, nullable and is required',
        },
        dateOfBirth: {
          bsonType: ['string', 'null'],
          description: 'Date of birth must be a string, nullable and is required',
        },
        weight: {
          bsonType: ['array', 'null'],
          description: 'Weight must be an array, nullable and is required',
          items: {
            bsonType: 'object',
            required: ['date', 'weight'],
            additionalProperties: false,
            properties: {
              date: {
                bsonType: 'string',
                description: 'Date must be a string and is required',
              },
              weight: {
                bsonType: 'double',
                description: 'Weight must be a double and is required',
              },
            },
          },
        },
        imageUrl: {
          bsonType: ['string', 'null'],
          description: 'Image URL must be a string, nullable and is required',
        },
      },
    },
  },
  validationAction: 'error',
  validationLevel: 'strict',
};
