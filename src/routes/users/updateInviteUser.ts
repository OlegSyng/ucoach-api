import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { traineeId: string };
type RequestBody = Omit<Trainee, 'userId' | '_id' | 'coachId'>;
type ResponseBody = Trainee | HttpError<StatusCode.NotFound>;

export const updateInviteUser = async (
  req: Request<Params, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { traineeId } = req.params;
    const { firstName, lastName, email } = req.body;

    const result = await db
      .collection<Trainee>(Collections.Trainees)
      .findOneAndUpdate(
        { _id: new ObjectId(traineeId) },
        { $set: { firstName, lastName, email } },
        { returnDocument: 'after' },
      );

    if (!result) {
      res.send(createError(StatusCode.NotFound, 'User with provided id not found'));
      return;
    }

    res.status(StatusCode.Success).json(result);
  } catch (error) {
    next(error);
  }
};
