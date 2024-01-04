import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Exercise } from '../../db/models/exercise.model.js';
import { db } from '../../db/mongo.js';
import { MessageCode, ResponseMessage, StatusCode } from '../../types/index.js';

type RequestBody = Omit<Exercise, '_id'>;
type ResponseBody = ResponseMessage | HttpError<StatusCode.InternalServerError>;

export const createExercise = async (
  req: Request<unknown, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { title, description, coachId, intensity, videoUrl, equipment } = req.body;

    const result = await db
      .collection(Collections.Exercises)
      .insertOne(new Exercise(title, description, coachId, intensity, videoUrl, equipment));

    if (!result.acknowledged) {
      res.send(createError(StatusCode.InternalServerError, 'Exercise not created'));
    }

    res
      .status(StatusCode.Created)
      .send(new ResponseMessage(MessageCode.Success, 'Exercise created successfully', result.insertedId.toString()));
  } catch (err) {
    next(err);
  }
};
