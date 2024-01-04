import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { User } from '../../db/models/user.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { id: string };
type RequstBody = Omit<User, '_id' | 'salt' | 'password_hash' | 'isCoach' | 'weight' | 'coachId'>;
type ResponseBody = User | HttpError<StatusCode.NotFound>;

export const updateUser = async (
  req: Request<Params, ResponseBody, RequstBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { username, firstName, lastName, email, dateOfBirth, imageUrl } = req.body;

    const user = await db.collection<User>(Collections.Users).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          username,
          firstName,
          lastName,
          email,
          dateOfBirth,
          imageUrl,
        },
      },
      { returnDocument: 'after' },
    );

    if (!user) {
      res.send(createError(StatusCode.NotFound, `Could not update user with id ${id}.`));
      return;
    }

    if (!user.isCoach) {
      const updatedTrainee = await db.collection<Trainee>(Collections.Trainees).findOneAndUpdate(
        { userId: id },
        {
          $set: {
            firstName: firstName || '',
            lastName: lastName || '',
            email,
          },
        },
        { returnDocument: 'after' },
      );

      if (!updatedTrainee) {
        res.send(createError(StatusCode.NotFound, `Could not update trainee with id ${id}.`));
        return;
      }
    }

    res.status(StatusCode.Success).json(user);
  } catch (err) {
    next(err);
  }
};
